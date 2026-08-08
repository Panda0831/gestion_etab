import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateActiviteDto } from './dto/create-activite.dto';
import { UpdateActiviteDto } from './dto/update-activite.dto';

@Injectable()
export class ActiviteService {
  constructor(private readonly prisma: PrismaService) {}

  create(createActiviteDto: CreateActiviteDto) {
    return this.prisma.activite.create({
      data: createActiviteDto as any,
    });
  }

  findAll() {
    return this.prisma.activite.findMany({
      include: {
        clubEvenement: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.activite.findUnique({
      where: { id },
      include: {
        clubEvenement: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Activité avec ID ${id} non trouvée`);
    }
    return item;
  }

  async update(id: string, updateActiviteDto: UpdateActiviteDto) {
    await this.findOne(id);
    return this.prisma.activite.update({
      where: { id },
      data: updateActiviteDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.activite.delete({ where: { id } });
  }
}
