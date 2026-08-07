import { Test, TestingModule } from '@nestjs/testing';
import { ClubEvenementMembreController } from './club-evenement-membre.controller';
import { ClubEvenementMembreService } from './club-evenement-membre.service';

describe('ClubEvenementMembreController', () => {
  let controller: ClubEvenementMembreController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubEvenementMembreController],
      providers: [ClubEvenementMembreService],
    }).compile();

    controller = module.get<ClubEvenementMembreController>(ClubEvenementMembreController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
