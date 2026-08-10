import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreatePointageDto } from './dto/create-pointage.dto';
import { UpdatePointageDto } from './dto/update-pointage.dto';

@Injectable()
export class PointageService {
  constructor(private readonly prisma: PrismaService) {}

  create(createPointageDto: CreatePointageDto) {
    return this.prisma.pointage.create({ data: createPointageDto });
  }

  findAll() {
    return this.prisma.pointage.findMany({
      orderBy: { datePointage: 'desc' },
      include: { professeur: true },
    });
  }

  async findOne(id: string) {
    const pointage = await this.prisma.pointage.findUnique({
      where: { id },
      include: { professeur: true },
    });
    if (!pointage)
      throw new NotFoundException(`Pointage avec ID ${id} non trouvé`);
    return pointage;
  }

  async update(id: string, updatePointageDto: UpdatePointageDto) {
    await this.findOne(id);
    return this.prisma.pointage.update({
      where: { id },
      data: updatePointageDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.pointage.delete({ where: { id } });
  }
}
