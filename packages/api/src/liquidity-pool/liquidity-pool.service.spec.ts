import { Test, TestingModule } from '@nestjs/testing';
import { LiquidityPoolService } from './liquidity-pool.service';

describe('LiquidityPoolService', () => {
  let service: LiquidityPoolService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LiquidityPoolService],
    }).compile();

    service = module.get<LiquidityPoolService>(LiquidityPoolService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
