import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { NiveauService } from './niveau.service';

describe('NiveauService', () => {
  let service: NiveauService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NiveauService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<NiveauService>(NiveauService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
