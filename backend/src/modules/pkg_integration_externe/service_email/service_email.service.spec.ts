import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ServiceEmailService } from './service_email.service';

describe('ServiceEmailService', () => {
  let service: ServiceEmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServiceEmailService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ServiceEmailService>(ServiceEmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
