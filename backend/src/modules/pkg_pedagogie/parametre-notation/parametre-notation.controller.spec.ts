import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ParametreNotationController } from './parametre-notation.controller';
import { ParametreNotationService } from './parametre-notation.service';

describe('ParametreNotationController', () => {
  let controller: ParametreNotationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ParametreNotationController],
      providers: [
        ParametreNotationService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ParametreNotationController>(
      ParametreNotationController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
