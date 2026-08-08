import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateBulletinDto } from './dto/create-bulletin.dto';
import { UpdateBulletinDto } from './dto/update-bulletin.dto';

@Injectable()
export class BulletinService {
  constructor(private readonly prisma: PrismaService) {}

  create(createBulletinDto: CreateBulletinDto) {
    return this.prisma.bulletin.create({
      data: createBulletinDto as any,
    });
  }

  findAll() {
    return this.prisma.bulletin.findMany({
      include: {
        eleve: { include: { utilisateur: true } },
        details: { include: { note: true } },
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.bulletin.findUnique({
      where: { id },
      include: {
        eleve: { include: { utilisateur: true } },
        details: { include: { note: true } },
      },
    });
    if (!item) {
      throw new NotFoundException(`Bulletin avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(id: string, updateBulletinDto: UpdateBulletinDto) {
    await this.findOne(id);
    return this.prisma.bulletin.update({
      where: { id },
      data: updateBulletinDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.bulletin.delete({ where: { id } });
  }
}
