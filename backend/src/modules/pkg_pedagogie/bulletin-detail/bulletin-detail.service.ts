import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBulletinDetailDto } from './dto/create-bulletin-detail.dto';
import { UpdateBulletinDetailDto } from './dto/update-bulletin-detail.dto';

@Injectable()
export class BulletinDetailService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBulletinDetailDto: CreateBulletinDetailDto) {
    return this.prisma.bulletinDetail.create({
      data: createBulletinDetailDto as any,
    });
  }

  findAll() {
    return this.prisma.bulletinDetail.findMany({
      include: {
        bulletin: true,
        note: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.bulletinDetail.findUnique({
      where: { id },
      include: {
        bulletin: true,
        note: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Détail bulletin avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(id: string, updateBulletinDetailDto: UpdateBulletinDetailDto) {
    await this.findOne(id);
    return this.prisma.bulletinDetail.update({
      where: { id },
      data: updateBulletinDetailDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.bulletinDetail.delete({ where: { id } });
  }
}
