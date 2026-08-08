import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ProfesseurMatiereController } from './professeur-matiere.controller';
import { ProfesseurMatiereService } from './professeur-matiere.service';

describe('ProfesseurMatiereController', () => {
  let controller: ProfesseurMatiereController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfesseurMatiereController],
      providers: [
        ProfesseurMatiereService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ProfesseurMatiereController>(ProfesseurMatiereController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
