import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ParentService } from './parent.service';

describe('ParentService', () => {
  let service: ParentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ParentService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ParentService>(ParentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
