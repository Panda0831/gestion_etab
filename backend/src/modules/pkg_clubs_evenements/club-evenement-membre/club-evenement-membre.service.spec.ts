import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ClubEvenementMembreService } from './club-evenement-membre.service';

describe('ClubEvenementMembreService', () => {
  let service: ClubEvenementMembreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubEvenementMembreService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ClubEvenementMembreService>(
      ClubEvenementMembreService,
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
