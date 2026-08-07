import { Test, TestingModule } from '@nestjs/testing';
import { ServiceMinIoS3Service } from './service_min-io_s3.service';

describe('ServiceMinIoS3Service', () => {
  let service: ServiceMinIoS3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServiceMinIoS3Service],
    }).compile();

    service = module.get<ServiceMinIoS3Service>(ServiceMinIoS3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
