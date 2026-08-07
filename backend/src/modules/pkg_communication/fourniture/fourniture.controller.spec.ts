import { Test, TestingModule } from '@nestjs/testing';
import { FournitureController } from './fourniture.controller';
import { FournitureService } from './fourniture.service';

describe('FournitureController', () => {
  let controller: FournitureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FournitureController],
      providers: [FournitureService],
    }).compile();

    controller = module.get<FournitureController>(FournitureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
