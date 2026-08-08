import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateNiveauDto } from './dto/create-niveau.dto';
import { UpdateNiveauDto } from './dto/update-niveau.dto';

@Injectable()
export class NiveauService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createNiveauDto: CreateNiveauDto) {
    return this.prisma.niveau.create({
      data: createNiveauDto,
    });
  }

  async findAll() {
    return this.prisma.niveau.findMany({
      include: {
        etablissement: { select: { id: true, nom: true } },
        classes: true,
      },
    });
  }

  async findOne(id: string) {
    const niveau = await this.prisma.niveau.findUnique({
      where: { id },
      include: {
        etablissement: true,
        classes: true,
        matieres: true,
      },
    });
    if (!niveau) {
      throw new NotFoundException(`Niveau avec ID ${id} non trouvé`);
    }
    return niveau;
  }

  async update(id: string, updateNiveauDto: UpdateNiveauDto) {
    await this.findOne(id);
    return this.prisma.niveau.update({
      where: { id },
      data: updateNiveauDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.niveau.delete({
      where: { id },
    });
  }
}

