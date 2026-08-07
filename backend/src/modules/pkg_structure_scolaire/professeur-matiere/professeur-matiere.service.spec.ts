import { Test, TestingModule } from '@nestjs/testing';
import { ProfesseurMatiereService } from './professeur-matiere.service';

describe('ProfesseurMatiereService', () => {
  let service: ProfesseurMatiereService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProfesseurMatiereService],
    }).compile();

    service = module.get<ProfesseurMatiereService>(ProfesseurMatiereService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
