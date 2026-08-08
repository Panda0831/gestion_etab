import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiOrangeMoneyController } from './api_orange_money.controller';
import { ApiOrangeMoneyService } from './api_orange_money.service';

describe('ApiOrangeMoneyController', () => {
  let controller: ApiOrangeMoneyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiOrangeMoneyController],
      providers: [
        ApiOrangeMoneyService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ApiOrangeMoneyController>(ApiOrangeMoneyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
