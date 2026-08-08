import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ClasseController } from './classe.controller';
import { ClasseService } from './classe.service';

describe('ClasseController', () => {
  let controller: ClasseController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClasseController],
      providers: [
        ClasseService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ClasseController>(ClasseController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
