import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMatiereDto } from './dto/create-matiere.dto';
import { UpdateMatiereDto } from './dto/update-matiere.dto';

@Injectable()
export class MatiereService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMatiereDto: CreateMatiereDto) {
    return this.prisma.matiere.create({ data: createMatiereDto });
  }

  findAll() {
    return this.prisma.matiere.findMany({ include: { etablissement: true } });
  }

  async findOne(id: string) {
    const matiere = await this.prisma.matiere.findUnique({
      where: { id },
      include: { etablissement: true },
    });
    if (!matiere)
      throw new NotFoundException(`Matière avec ID ${id} non trouvée`);
    return matiere;
  }

  async update(id: string, updateMatiereDto: UpdateMatiereDto) {
    await this.findOne(id);
    return this.prisma.matiere.update({
      where: { id },
      data: updateMatiereDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.matiere.delete({ where: { id } });
  }
}
