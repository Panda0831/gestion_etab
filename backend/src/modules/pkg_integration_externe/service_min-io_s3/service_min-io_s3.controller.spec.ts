import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceMinIoS3Controller } from './service_min-io_s3.controller';
import { ServiceMinIoS3Service } from './service_min-io_s3.service';

describe('ServiceMinIoS3Controller', () => {
  let controller: ServiceMinIoS3Controller;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServiceMinIoS3Controller],
      providers: [
        ServiceMinIoS3Service,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<ServiceMinIoS3Controller>(ServiceMinIoS3Controller);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
