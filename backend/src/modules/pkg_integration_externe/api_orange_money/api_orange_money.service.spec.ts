import { Test, TestingModule } from '@nestjs/testing';
import { ApiOrangeMoneyService } from './api_orange_money.service';

describe('ApiOrangeMoneyService', () => {
  let service: ApiOrangeMoneyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiOrangeMoneyService],
    }).compile();

    service = module.get<ApiOrangeMoneyService>(ApiOrangeMoneyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
