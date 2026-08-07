import { Test, TestingModule } from '@nestjs/testing';
import { ClubEvenementOrganisateurService } from './club-evenement-organisateur.service';

describe('ClubEvenementOrganisateurService', () => {
  let service: ClubEvenementOrganisateurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClubEvenementOrganisateurService],
    }).compile();

    service = module.get<ClubEvenementOrganisateurService>(ClubEvenementOrganisateurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
