// liquidity-pool.controller.ts
import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import {
  AddLiquidityDto,
  LiquidityPoolService,
  SwapDto,
} from './liquidity-pool.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateTokenDto, TokenService } from './token.service';

@Controller('liquidity')
@UseGuards(JwtAuthGuard)
export class LiquidityPoolController {
  constructor(
    private readonly liquidityPoolService: LiquidityPoolService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('create-pool')
  async createPool(@Body('tokenSymbol') tokenSymbol: string) {
    return this.liquidityPoolService.createLiquidityPool(tokenSymbol);
  }

  @Post('add-liquidity')
  async addLiquidity(
    @Body() addLiquidityDto: Omit<AddLiquidityDto, 'userTelegramId'>,
    @Req() req,
  ) {
    return this.liquidityPoolService.addLiquidity({
      ...addLiquidityDto,
      userTelegramId: req.user.id,
    });
  }

  @Post('swap')
  async swap(@Body() swapDto: Omit<SwapDto, 'userTelegramId'>, @Req() req) {
    return this.liquidityPoolService.swap({
      ...swapDto,
      userTelegramId: req.user.id,
    });
  }

  @Post('create-token')
  async createToken(
    @Body() createTokenDto: Omit<CreateTokenDto, 'creatorTelegramId'>,
    @Req() req,
  ) {
    return this.tokenService.createToken({
      ...createTokenDto,
      creatorTelegramId: req.user.id,
    });
  }
}
