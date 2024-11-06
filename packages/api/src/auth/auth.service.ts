import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { parse, validate } from '@telegram-apps/init-data-node';
import { customAlphabet } from 'nanoid';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { getTelegramUserAge } from '../utils/utils';
import { Telegraf } from 'telegraf';
import { InjectBot } from 'nestjs-telegraf';
(BigInt.prototype as any).toJSON = function (): number {
  return this.toString();
};

@Injectable()
export class AuthService {
  private nanoid: (size?: number) => string;

  constructor(
    private jwtService: JwtService,
    private readonly prismaService: PrismaService,
    @InjectBot() private bot: Telegraf,
  ) {
    const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    this.nanoid = customAlphabet(alphabet, 8);
  }

  async validateUser(initData: string): Promise<any> {
    try {
      const secretToken = process.env.TELEGRAM_TOKEN;
      validate(initData, secretToken);
      const data = parse(initData);
      return data.user;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async checkUser(initData: string) {
    const user: User = await this.validateUser(initData);
    if (!user) {
      throw new UnauthorizedException();
    }
    const userExists = await this.prismaService.user.findUnique({
      where: { telegramId: user.id },
    });
    return { userExists };
  }

  async login(initData: any, referralCode: string) {
    const user: User = await this.validateUser(initData);
    if (!user) {
      throw new UnauthorizedException();
    }
    const newReferralCode = await this.generateReferralCode();

    let referrer: User | null = null;
    if (referralCode) {
      referrer = await this.prismaService.user.findUnique({
        where: { referralCode },
      });
      // if (referrer) {
      //   await this.prismaService.user.update({
      //     where: { id: referrer.id },
      //     data: {
      //       xpBalance: {
      //         increment: user.isPremium ? 1000 : 100,
      //       },
      //     },
      //   });
      // }
    }
    const images = await this.bot.telegram.getUserProfilePhotos(user.id, 0);
    const profilePhoto = images.photos[0]?.[0]?.file_id;
    let photo_url = null;
    if (profilePhoto) {
      const photoUrl = await this.bot.telegram.getFileLink(profilePhoto);
      if (photoUrl.pathname) {
        photo_url = `https://api.telegram.org/file/bot${process.env.TELEGRAM_TOKEN}/${photoUrl.pathname}`;
      }
    }

    const userDB: User = await this.prismaService.user.upsert({
      where: { telegramId: user.id },
      update: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        languageCode: user.languageCode,
        photoUrl: photo_url,
        isPremium: user.isPremium,
      },
      create: {
        telegramId: user.id,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        languageCode: user.languageCode,
        photoUrl: photo_url,
        isPremium: user.isPremium,
        referralCode: newReferralCode,
        referredByCode: referrer?.referralCode,
      },
    });

    const payload = { ...userDB };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async generateReferralCode(): Promise<string> {
    let code: string;
    let isUnique = false;

    while (!isUnique) {
      code = this.nanoid();
      const existingUser = await this.prismaService.user.findUnique({
        where: { referralCode: code },
      });
      isUnique = !existingUser;
    }

    return code;
  }
}
