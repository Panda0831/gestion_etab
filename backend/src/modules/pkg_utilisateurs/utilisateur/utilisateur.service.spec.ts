import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UtilisateurService } from './utilisateur.service';

describe('UtilisateurService', () => {
  let service: UtilisateurService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UtilisateurService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<UtilisateurService>(UtilisateurService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
