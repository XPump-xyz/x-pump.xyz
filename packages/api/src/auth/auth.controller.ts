import { Controller, Post, Body, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCacheInterceptor } from '../interceptors/user-cache.interceptor';

@Controller('auth')
@UseInterceptors(UserCacheInterceptor)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req) {
    return this.authService.login(req.initData, req.referralCode);
  }
}
