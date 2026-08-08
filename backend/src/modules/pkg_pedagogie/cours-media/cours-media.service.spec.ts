import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CoursMediaService } from './cours-media.service';

describe('CoursMediaService', () => {
  let service: CoursMediaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursMediaService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<CoursMediaService>(CoursMediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
