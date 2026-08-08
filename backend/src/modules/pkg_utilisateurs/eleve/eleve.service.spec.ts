import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EleveService } from './eleve.service';

describe('EleveService', () => {
  let service: EleveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EleveService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<EleveService>(EleveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
