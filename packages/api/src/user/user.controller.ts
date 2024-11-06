import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserCacheInterceptor } from '../interceptors/user-cache.interceptor';
import { WalletService } from './wallet.service';

@UseInterceptors(UserCacheInterceptor)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly walletService: WalletService,
  ) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() req) {
    const user = await this.userService.findById(Number(req.user.id));
    return user;
  }

  @Post('/wallet/create')
  async createWallet(@Req() req) {
    return this.walletService.createWallet(req.user.id);
  }

  @Post('/wallet/import')
  async importWallet(@Req() req, @Body('seed') seed: string) {
    if (!seed) {
      throw new BadRequestException('Seed is required');
    }
    return this.walletService.importWallet(req.user.id, seed);
  }

  @Get('/wallet/info')
  async getWalletInfo(@Req() req) {
    return this.walletService.getWalletInfo(req.user.id);
  }
}
