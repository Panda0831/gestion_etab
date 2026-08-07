import { Test, TestingModule } from '@nestjs/testing';
import { BulletinDetailService } from './bulletin-detail.service';

describe('BulletinDetailService', () => {
  let service: BulletinDetailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BulletinDetailService],
    }).compile();

    service = module.get<BulletinDetailService>(BulletinDetailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
