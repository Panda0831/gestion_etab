import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ParametreNotationService } from './parametre-notation.service';

describe('ParametreNotationService', () => {
  let service: ParametreNotationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParametreNotationService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ParametreNotationService>(ParametreNotationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
