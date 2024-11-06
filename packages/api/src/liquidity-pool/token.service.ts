// token.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  AccountSet,
  Client,
  Payment,
  TrustSet,
  Wallet,
  convertStringToHex,
} from 'xrpl';
import { ConfigService } from '@nestjs/config';

export interface CreateTokenDto {
  name: string;
  symbol: string;
  totalSupply: string;
  description?: string;
  telegramChat?: string;
  telegramChannel?: string;
  website?: string;
  twitter?: string;
  creatorTelegramId: number;
}

@Injectable()
export class TokenService {
  private readonly logger = new Logger(TokenService.name);
  private client: Client;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    // Initialize XRPL client
    this.client = new Client(this.configService.get<string>('XRPL_NODE_URL'));
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async createToken(dto: CreateTokenDto) {
    try {
      // 1. Get or create user from Telegram ID
      const user = await this.prisma.user.findUnique({
        where: { telegramId: dto.creatorTelegramId },
      });

      if (!user || !user.walletAddress) {
        throw new BadRequestException('User wallet not configured');
      }

      // 2. Generate wallet for token issuer
      const issuerWallet = await this.createIssuerWallet();

      // 3. Set up token on XRPL
      const currencyCode = this.formatCurrencyCode(dto.symbol);
      await this.setupTokenOnXRPL(
        issuerWallet,
        user.walletAddress,
        currencyCode,
        dto.totalSupply,
      );

      // 4. Store token information in database
      const token = await this.prisma.token.create({
        data: {
          name: dto.name,
          symbol: dto.symbol,
          totalSupply: dto.totalSupply,
          description: dto.description,
          telegramChat: dto.telegramChat,
          telegramChannel: dto.telegramChannel,
          issuerAddress: issuerWallet.address,
          website: dto.website,
          twitter: dto.twitter,
          creatorId: user.id,
        },
      });

      // 5. Create initial portfolio entry for creator
      await this.prisma.portfolio.create({
        data: {
          userId: user.id,
          tokenId: token.id,
          amount: dto.totalSupply,
        },
      });

      // 6. Create deploy transaction record
      await this.prisma.transaction.create({
        data: {
          type: 'DEPLOY',
          amount: 0,
          tokenAmount: dto.totalSupply,
          price: 0,
          tokenId: token.id,
          userId: user.id,
        },
      });

      return {
        token,
        issuerAddress: issuerWallet.address,
        currencyCode,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create token: ${error.message}`,
        error.stack,
      );
      throw new BadRequestException(`Token creation failed: ${error.message}`);
    }
  }

  private async createIssuerWallet() {
    try {
      // Generate new wallet for token issuer
      const { wallet: issuerWallet } = await this.client.fundWallet();

      // Set DefaultRipple on issuer account
      const defaultRippleTx: AccountSet = {
        TransactionType: 'AccountSet',
        Account: issuerWallet.address,
        SetFlag: 8,
      };

      const defaultRippleResult = await this.client.submitAndWait(
        defaultRippleTx,
        {
          wallet: issuerWallet,
        },
      );

      if (
        (defaultRippleResult.result.meta as any).TransactionResult !==
        'tesSUCCESS'
      ) {
        throw new Error('Failed to set DefaultRipple');
      }

      return issuerWallet;
    } catch (error) {
      this.logger.error('Failed to create issuer wallet:', error);
      throw error;
    }
  }

  private async setupTokenOnXRPL(
    issuerWallet: Wallet,
    userWalletAddress: string,
    currencyCode: string,
    totalSupply: string,
  ) {
    try {
      // 1. Create trust line from user to issuer
      const trustSetTx: TrustSet = {
        TransactionType: 'TrustSet',
        Account: userWalletAddress,
        LimitAmount: {
          currency: currencyCode,
          issuer: issuerWallet.address,
          value: totalSupply,
        },
      };

      const trustSetResult = await this.client.submitAndWait(trustSetTx, {
        wallet: issuerWallet,
      });

      if (
        (trustSetResult.result.meta as any).TransactionResult !== 'tesSUCCESS'
      ) {
        throw new Error('Failed to create trust line');
      }

      // 2. Issue token to user
      const paymentTx: Payment = {
        TransactionType: 'Payment',
        Account: issuerWallet.address,
        Destination: userWalletAddress,
        Amount: {
          currency: currencyCode,
          value: totalSupply,
          issuer: issuerWallet.address,
        },
      };

      const paymentResult = await this.client.submitAndWait(paymentTx, {
        wallet: issuerWallet,
      });

      if (
        (paymentResult.result.meta as any).TransactionResult !== 'tesSUCCESS'
      ) {
        throw new Error('Failed to issue tokens');
      }

      return true;
    } catch (error) {
      this.logger.error('Failed to setup token on XRPL:', error);
      throw error;
    }
  }

  private formatCurrencyCode(symbol: string): string {
    // Convert symbol to standard 3-character currency code or 40-char hex
    if (symbol.length <= 3) {
      return symbol.toUpperCase().padEnd(3, ' ');
    } else {
      return convertStringToHex(symbol).padEnd(40, '0');
    }
  }
}
