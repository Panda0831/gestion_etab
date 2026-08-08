import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionController } from './discussion.controller';
import { DiscussionService } from './discussion.service';

describe('DiscussionController', () => {
  let controller: DiscussionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionController],
      providers: [
        DiscussionService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<DiscussionController>(DiscussionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
