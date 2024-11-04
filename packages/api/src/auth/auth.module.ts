import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';
import { CacheService } from '../cache/cache.service';
import { TelegrafModule } from 'nestjs-telegraf';

@Module({
  imports: [
    PrismaModule,
    PassportModule,
    TelegrafModule.forRoot({
      token: process.env.TELEGRAM_TOKEN,
    }),
  ],
  providers: [AuthService, JwtStrategy, PrismaService, CacheService],
  controllers: [AuthController],
})
export class AuthModule {}
