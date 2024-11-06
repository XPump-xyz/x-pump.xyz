import { Module } from '@nestjs/common';
import { LiquidityPoolService } from './liquidity-pool.service';
import { LiquidityPoolController } from './liquidity-pool.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { TokenService } from './token.service';

@Module({
  imports: [PrismaModule],
  controllers: [LiquidityPoolController],
  providers: [LiquidityPoolService, TokenService],
})
export class LiquidityPoolModule {}
