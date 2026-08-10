import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateParametreNotationDto } from './dto/create-parametre-notation.dto';
import { UpdateParametreNotationDto } from './dto/update-parametre-notation.dto';

@Injectable()
export class ParametreNotationService {
  constructor(private readonly prisma: PrismaService) {}

  create(createParametreNotationDto: CreateParametreNotationDto) {
    return this.prisma.parametreNotation.create({
      data: createParametreNotationDto as any,
    });
  }

  findAll() {
    return this.prisma.parametreNotation.findMany({
      include: {
        etablissement: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.parametreNotation.findUnique({
      where: { id },
      include: {
        etablissement: true,
      },
    });
    if (!item) {
      throw new NotFoundException(
        `Paramètre de notation avec ID ${id} non trouvé`,
      );
    }
    return item;
  }

  async update(
    id: string,
    updateParametreNotationDto: UpdateParametreNotationDto,
  ) {
    await this.findOne(id);
    return this.prisma.parametreNotation.update({
      where: { id },
      data: updateParametreNotationDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.parametreNotation.delete({ where: { id } });
  }
}
