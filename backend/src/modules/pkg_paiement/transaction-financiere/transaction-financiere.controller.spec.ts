import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionFinanciereController } from './transaction-financiere.controller';
import { TransactionFinanciereService } from './transaction-financiere.service';

describe('TransactionFinanciereController', () => {
  let controller: TransactionFinanciereController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionFinanciereController],
      providers: [
        TransactionFinanciereService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<TransactionFinanciereController>(TransactionFinanciereController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
