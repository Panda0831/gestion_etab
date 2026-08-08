import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ClubEvenementController } from './club-evenement.controller';
import { ClubEvenementService } from './club-evenement.service';

describe('ClubEvenementController', () => {
  let controller: ClubEvenementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClubEvenementController],
      providers: [
        ClubEvenementService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ClubEvenementController>(ClubEvenementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
