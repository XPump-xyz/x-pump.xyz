// liquidity-pool.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AMMCreate,
  AMMDeposit,
  Client,
  Payment,
  Wallet,
  xrpToDrops,
} from 'xrpl';
import { ConfigService } from '@nestjs/config';
import BigNumber from 'bignumber.js';

export interface AddLiquidityDto {
  tokenSymbol: string;
  xrpAmount: string;
  tokenAmount: string;
  userTelegramId: number;
}

export interface SwapDto {
  fromToken: string; // 'XRP' or token symbol
  toToken: string;
  amount: string;
  userTelegramId: number;
  slippageTolerance: number; // in percentage
}

@Injectable()
export class LiquidityPoolService {
  private readonly logger = new Logger(LiquidityPoolService.name);
  private client: Client;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.client = new Client(this.configService.get<string>('XRPL_NODE_URL'));
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async createLiquidityPool(tokenSymbol: string) {
    try {
      // Get token details from database
      const token = await this.prisma.token.findUnique({
        where: { symbol: tokenSymbol },
      });

      if (!token) {
        throw new BadRequestException('Token not found');
      }

      // Create AMM account on XRPL
      const ammWallet = await this.createAMMWallet();

      // Submit AMMCreate transaction
      const ammCreateTx: AMMCreate = {
        TransactionType: 'AMMCreate',
        Account: ammWallet.address,
        Amount: '0',
        Amount2: {
          currency: token.symbol,
          issuer: token.issuerAddress,
          value: '0',
        },
        TradingFee: 30, // 0.3% fee in basis points
      };

      const result = await this.client.submitAndWait(ammCreateTx, {
        wallet: ammWallet,
        autofill: true,
        failHard: true,
      });

      if ((result.result.meta as any).TransactionResult !== 'tesSUCCESS') {
        throw new Error('Failed to create AMM');
      }

      // Store pool information in database
      const pool = await this.prisma.liquidityPool.create({
        data: {
          tokenId: token.id,
          ammAddress: ammWallet.address,
          xrpReserve: '0',
          tokenReserve: '0',
          totalLPTokens: '0',
        },
      });

      return pool;
    } catch (error) {
      this.logger.error(`Failed to create liquidity pool: ${error.message}`);
      throw new BadRequestException(
        `Liquidity pool creation failed: ${error.message}`,
      );
    }
  }

  async addLiquidity(dto: AddLiquidityDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { telegramId: Number(dto.userTelegramId) },
      });

      if (!user || !user.walletAddress) {
        throw new BadRequestException('User wallet not configured');
      }

      const pool = await this.prisma.liquidityPool.findFirst({
        where: {
          token: {
            symbol: dto.tokenSymbol,
          },
        },
        include: {
          token: true,
        },
      });

      if (!pool) {
        throw new BadRequestException('Liquidity pool not found');
      }

      // Submit AMMDeposit transaction
      const ammDepositTx: AMMDeposit = {
        TransactionType: 'AMMDeposit',
        Account: user.walletAddress,
        Asset: {
          currency: 'XRP',
        },
        Asset2: {
          currency: pool.token.symbol,
          issuer: pool.token.issuerAddress,
        },
        Amount: dto.xrpAmount,
        Amount2: {
          currency: pool.token.symbol,
          issuer: pool.token.issuerAddress,
          value: dto.tokenAmount,
        },
      };

      const result = await this.client.submitAndWait(ammDepositTx, {
        wallet: Wallet.fromSeed(user.walletSeed), // You'll need to handle wallet security appropriately
      });

      if ((result.result.meta as any).TransactionResult !== 'tesSUCCESS') {
        throw new Error('Failed to add liquidity');
      }

      // Update pool reserves
      await this.prisma.liquidityPool.update({
        where: { id: pool.id },
        data: {
          xrpReserve: new BigNumber(pool.xrpReserve)
            .plus(dto.xrpAmount)
            .toString(),
          tokenReserve: new BigNumber(pool.tokenReserve)
            .plus(dto.tokenAmount)
            .toString(),
        },
      });

      // Create LP position record
      await this.prisma.liquidityPosition.create({
        data: {
          userId: user.id,
          poolId: pool.id,
          xrpAmount: dto.xrpAmount,
          tokenAmount: dto.tokenAmount,
        },
      });

      return { success: true };
    } catch (error) {
      this.logger.error(`Failed to add liquidity: ${error.message}`);
      throw new BadRequestException(
        `Adding liquidity failed: ${error.message}`,
      );
    }
  }

  async swap(dto: SwapDto) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { telegramId: dto.userTelegramId },
      });

      if (!user || !user.walletAddress) {
        throw new BadRequestException('User wallet not configured');
      }

      const pool = await this.prisma.liquidityPool.findFirst({
        where: {
          token: {
            symbol: dto.fromToken === 'XRP' ? dto.toToken : dto.fromToken,
          },
        },
        include: {
          token: true,
        },
      });

      if (!pool) {
        throw new BadRequestException('Liquidity pool not found');
      }

      // Calculate expected output amount using constant product formula
      const expectedOutput = this.calculateSwapOutput(
        dto.amount,
        dto.fromToken === 'XRP' ? pool.xrpReserve : pool.tokenReserve,
        dto.fromToken === 'XRP' ? pool.tokenReserve : pool.xrpReserve,
      );

      // Apply slippage tolerance
      const minOutput = new BigNumber(expectedOutput)
        .multipliedBy(1 - dto.slippageTolerance / 100)
        .toString();

      // Submit AMMSwap transaction
      const ammSwapTx: Payment = {
        TransactionType: 'Payment',
        Account: user.walletAddress,
        Amount:
          dto.fromToken === 'XRP'
            ? xrpToDrops(dto.amount)
            : {
                currency: dto.fromToken,
                issuer: pool.token.issuerAddress,
                value: dto.amount,
              },
        Destination: pool.ammAddress,
        DeliverMin:
          dto.toToken === 'XRP'
            ? xrpToDrops(minOutput)
            : {
                currency: dto.toToken,
                issuer: pool.token.issuerAddress,
                value: minOutput,
              },
      };

      const result = await this.client.submitAndWait(ammSwapTx, {
        wallet: Wallet.fromSeed(user.walletSeed),
      });

      if ((result.result.meta as any).TransactionResult !== 'tesSUCCESS') {
        throw new Error('Swap failed');
      }

      // Record swap transaction
      await this.prisma.swapTransaction.create({
        data: {
          userId: user.id,
          poolId: pool.id,
          fromToken: dto.fromToken,
          toToken: dto.toToken,
          fromAmount: dto.amount,
          toAmount: expectedOutput,
          timestamp: new Date(),
        },
      });

      return {
        success: true,
        amountOut: expectedOutput,
      };
    } catch (error) {
      this.logger.error(`Failed to execute swap: ${error.message}`);
      throw new BadRequestException(`Swap failed: ${error.message}`);
    }
  }

  private calculateSwapOutput(
    amountIn: string,
    reserveIn: string,
    reserveOut: string,
  ): string {
    // Using constant product formula: x * y = k
    const amountInWithFee = new BigNumber(amountIn).multipliedBy(997); // 0.3% fee
    const numerator = amountInWithFee.multipliedBy(reserveOut);
    const denominator = new BigNumber(reserveIn)
      .multipliedBy(1000)
      .plus(amountInWithFee);
    return numerator.dividedBy(denominator).toString();
  }

  private async createAMMWallet() {
    try {
      const { wallet } = await this.client.fundWallet();
      return wallet;
    } catch (error) {
      this.logger.error('Failed to create AMM wallet:', error);
      throw error;
    }
  }
}
