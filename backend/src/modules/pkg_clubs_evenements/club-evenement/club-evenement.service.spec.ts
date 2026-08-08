import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ClubEvenementService } from './club-evenement.service';

describe('ClubEvenementService', () => {
  let service: ClubEvenementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClubEvenementService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ClubEvenementService>(ClubEvenementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
