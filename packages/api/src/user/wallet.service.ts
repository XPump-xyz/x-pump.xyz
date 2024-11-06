// wallet.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Client, Wallet, dropsToXrp } from 'xrpl';
import { ConfigService } from '@nestjs/config';
import { EncryptionService } from './encryption.service';

export interface WalletResponse {
  address: string;
  isNew: boolean;
}

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  private client: Client;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private encryptionService: EncryptionService,
  ) {
    this.client = new Client(this.configService.get<string>('XRPL_NODE_URL'));
  }

  async onModuleInit() {
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.disconnect();
  }

  async createWallet(telegramId: string): Promise<WalletResponse> {
    try {
      // Check if user already has a wallet
      const existingUser = await this.prisma.user.findUnique({
        where: { telegramId: Number(telegramId) },
      });

      if (existingUser?.walletAddress) {
        throw new BadRequestException('User already has a wallet');
      }

      // Generate new wallet
      const { wallet, balance } = await this.client.fundWallet();

      // Encrypt the seed
      const encryptedSeed = await this.encryptionService.encrypt(
        wallet.seed,
        this.configService.get('ENCRYPTION_KEY'),
      );

      // Update or create user with wallet info
      await this.prisma.user.update({
        where: { telegramId: Number(telegramId) },
        data: {
          walletAddress: wallet.address,
          walletSeed: encryptedSeed,
          walletType: 'CREATED',
        },
      });

      return {
        address: wallet.address,
        isNew: true,
      };
    } catch (error) {
      this.logger.error(`Failed to create wallet: ${error.message}`);
      throw new BadRequestException(`Wallet creation failed: ${error.message}`);
    }
  }

  async importWallet(
    telegramId: string,
    seed: string,
  ): Promise<WalletResponse> {
    try {
      // Validate seed format
      let wallet: Wallet;
      try {
        wallet = Wallet.fromSeed(seed);
      } catch (error) {
        throw new BadRequestException('Invalid wallet seed');
      }

      // Check if wallet is already imported
      const existingUser = await this.prisma.user.findFirst({
        where: { walletAddress: wallet.address },
      });

      if (existingUser) {
        throw new BadRequestException(
          'Wallet already imported by another user',
        );
      }

      // Get wallet balance

      // Encrypt the seed
      const encryptedSeed = await this.encryptionService.encrypt(
        seed,
        this.configService.get('ENCRYPTION_KEY'),
      );

      // Update or create user with imported wallet info
      await this.prisma.user.update({
        where: { telegramId: Number(telegramId) },
        data: {
          walletAddress: wallet.address,
          walletSeed: encryptedSeed,
          walletType: 'IMPORTED',
        },
      });

      return {
        address: wallet.address,
        isNew: false,
      };
    } catch (error) {
      this.logger.error(`Failed to import wallet: ${error.message}`);
      throw new BadRequestException(`Wallet import failed: ${error.message}`);
    }
  }

  async getWalletInfo(telegramId: number): Promise<WalletResponse> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { telegramId },
      });

      if (!user?.walletAddress) {
        throw new BadRequestException('No wallet found for user');
      }

      return {
        address: user.walletAddress,
        isNew: false,
      };
    } catch (error) {
      this.logger.error(`Failed to get wallet info: ${error.message}`);
      throw new BadRequestException(
        `Failed to get wallet info: ${error.message}`,
      );
    }
  }

  async getWalletForTransaction(telegramId: number): Promise<Wallet> {
    try {
      const user = await this.prisma.user.findUnique({
        where: { telegramId: Number(telegramId) },
      });

      if (!user?.walletSeed) {
        throw new BadRequestException('No wallet found for user');
      }

      const decryptedSeed = await this.encryptionService.decrypt(
        user.walletSeed,
        this.configService.get('ENCRYPTION_KEY'),
      );

      return Wallet.fromSeed(decryptedSeed);
    } catch (error) {
      this.logger.error(
        `Failed to get wallet for transaction: ${error.message}`,
      );
      throw new BadRequestException('Failed to access wallet');
    }
  }
}
