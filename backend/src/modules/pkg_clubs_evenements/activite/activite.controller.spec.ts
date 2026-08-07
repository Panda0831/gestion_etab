import { Test, TestingModule } from '@nestjs/testing';
import { ActiviteController } from './activite.controller';
import { ActiviteService } from './activite.service';

describe('ActiviteController', () => {
  let controller: ActiviteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActiviteController],
      providers: [ActiviteService],
    }).compile();

    controller = module.get<ActiviteController>(ActiviteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
