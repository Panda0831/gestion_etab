import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { CoursMediaController } from './cours-media.controller';
import { CoursMediaService } from './cours-media.service';

describe('CoursMediaController', () => {
  let controller: CoursMediaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursMediaController],
      providers: [
        CoursMediaService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<CoursMediaController>(CoursMediaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
