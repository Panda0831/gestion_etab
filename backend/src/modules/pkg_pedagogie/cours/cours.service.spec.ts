import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CoursService } from './cours.service';

describe('CoursService', () => {
  let service: CoursService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CoursService>(CoursService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
