import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionMembreController } from './discussion-membre.controller';
import { DiscussionMembreService } from './discussion-membre.service';

describe('DiscussionMembreController', () => {
  let controller: DiscussionMembreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscussionMembreController],
      providers: [DiscussionMembreService],
    }).compile();

    controller = module.get<DiscussionMembreController>(DiscussionMembreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
