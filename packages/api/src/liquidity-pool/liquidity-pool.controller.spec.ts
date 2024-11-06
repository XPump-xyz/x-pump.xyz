import { Test, TestingModule } from '@nestjs/testing';
import { LiquidityPoolController } from './liquidity-pool.controller';
import { LiquidityPoolService } from './liquidity-pool.service';

describe('LiquidityPoolController', () => {
  let controller: LiquidityPoolController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LiquidityPoolController],
      providers: [LiquidityPoolService],
    }).compile();

    controller = module.get<LiquidityPoolController>(LiquidityPoolController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
