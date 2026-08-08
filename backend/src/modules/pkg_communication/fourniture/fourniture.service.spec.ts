import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { FournitureService } from './fourniture.service';

describe('FournitureService', () => {
  let service: FournitureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FournitureService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<FournitureService>(FournitureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
