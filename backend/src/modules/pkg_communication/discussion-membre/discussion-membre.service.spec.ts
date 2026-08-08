import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionMembreService } from './discussion-membre.service';

describe('DiscussionMembreService', () => {
  let service: DiscussionMembreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiscussionMembreService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<DiscussionMembreService>(DiscussionMembreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
