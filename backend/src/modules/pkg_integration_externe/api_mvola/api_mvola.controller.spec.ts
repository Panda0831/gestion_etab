import { Test, TestingModule } from '@nestjs/testing';
import { ApiMvolaController } from './api_mvola.controller';
import { ApiMvolaService } from './api_mvola.service';

describe('ApiMvolaController', () => {
  let controller: ApiMvolaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiMvolaController],
      providers: [ApiMvolaService],
    }).compile();

    controller = module.get<ApiMvolaController>(ApiMvolaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
