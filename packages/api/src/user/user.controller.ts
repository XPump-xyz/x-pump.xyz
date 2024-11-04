import {
  Controller,
  Get,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UserCacheInterceptor } from '../interceptors/user-cache.interceptor';

@UseInterceptors(UserCacheInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async findOne(@Req() req) {
    const user = await this.userService.findById(Number(req.user.id));
    return user;
  }
}
