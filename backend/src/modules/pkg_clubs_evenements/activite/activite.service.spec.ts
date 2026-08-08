import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ActiviteService } from './activite.service';

describe('ActiviteService', () => {
  let service: ActiviteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ActiviteService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ActiviteService>(ActiviteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
