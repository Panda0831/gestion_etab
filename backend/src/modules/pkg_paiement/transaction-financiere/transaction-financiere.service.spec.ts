import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionFinanciereService } from './transaction-financiere.service';

describe('TransactionFinanciereService', () => {
  let service: TransactionFinanciereService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionFinanciereService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<TransactionFinanciereService>(
      TransactionFinanciereService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
