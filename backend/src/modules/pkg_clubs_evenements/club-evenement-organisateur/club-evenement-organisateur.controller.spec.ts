import { Test, TestingModule } from '@nestjs/testing';
import { ClubEvenementOrganisateurController } from './club-evenement-organisateur.controller';
import { ClubEvenementOrganisateurService } from './club-evenement-organisateur.service';

describe('ClubEvenementOrganisateurController', () => {
  let controller: ClubEvenementOrganisateurController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubEvenementOrganisateurController],
      providers: [ClubEvenementOrganisateurService],
    }).compile();

    controller = module.get<ClubEvenementOrganisateurController>(ClubEvenementOrganisateurController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
