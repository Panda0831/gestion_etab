import { PrismaService } from '../../../prisma/prisma.service';
import { Test, TestingModule } from '@nestjs/testing';
import { BulletinDetailController } from './bulletin-detail.controller';
import { BulletinDetailService } from './bulletin-detail.service';

describe('BulletinDetailController', () => {
  let controller: BulletinDetailController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BulletinDetailController],
      providers: [
        BulletinDetailService,
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BulletinDetailController>(BulletinDetailController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
