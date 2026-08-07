import { Test, TestingModule } from '@nestjs/testing';
import { EleveController } from './eleve.controller';
import { EleveService } from './eleve.service';

describe('EleveController', () => {
  let controller: EleveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EleveController],
      providers: [EleveService],
    }).compile();

    controller = module.get<EleveController>(EleveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
