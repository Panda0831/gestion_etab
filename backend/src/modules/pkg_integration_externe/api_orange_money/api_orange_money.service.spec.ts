import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiOrangeMoneyService } from './api_orange_money.service';

describe('ApiOrangeMoneyService', () => {
  let service: ApiOrangeMoneyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiOrangeMoneyService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ApiOrangeMoneyService>(ApiOrangeMoneyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
