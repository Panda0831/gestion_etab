import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ApiMvolaService } from './api_mvola.service';

describe('ApiMvolaService', () => {
  let service: ApiMvolaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiMvolaService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ApiMvolaService>(ApiMvolaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
