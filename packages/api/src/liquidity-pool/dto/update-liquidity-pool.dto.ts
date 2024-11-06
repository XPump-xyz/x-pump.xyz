import { PartialType } from '@nestjs/swagger';
import { CreateLiquidityPoolDto } from './create-liquidity-pool.dto';

export class UpdateLiquidityPoolDto extends PartialType(CreateLiquidityPoolDto) {}
