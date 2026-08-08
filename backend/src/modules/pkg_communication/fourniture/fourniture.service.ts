import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateFournitureDto } from './dto/create-fourniture.dto';
import { UpdateFournitureDto } from './dto/update-fourniture.dto';

@Injectable()
export class FournitureService {
  constructor(private readonly prisma: PrismaService) {}

  create(createFournitureDto: CreateFournitureDto) {
    return this.prisma.fourniture.create({
      data: createFournitureDto as any,
    });
  }

  findAll() {
    return this.prisma.fourniture.findMany({
      include: {
        niveau: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.fourniture.findUnique({
      where: { id },
      include: {
        niveau: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Fourniture avec ID ${id} non trouvée`);
    }
    return item;
  }

  async update(id: string, updateFournitureDto: UpdateFournitureDto) {
    await this.findOne(id);
    return this.prisma.fourniture.update({
      where: { id },
      data: updateFournitureDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.fourniture.delete({ where: { id } });
  }
}
