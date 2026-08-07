import { Test, TestingModule } from '@nestjs/testing';
import { ServiceEmailController } from './service_email.controller';
import { ServiceEmailService } from './service_email.service';

describe('ServiceEmailController', () => {
  let controller: ServiceEmailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceEmailController],
      providers: [ServiceEmailService],
    }).compile();

    controller = module.get<ServiceEmailController>(ServiceEmailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
