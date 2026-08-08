import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEtablissementDto } from './dto/create-etablissement.dto';
import { UpdateEtablissementDto } from './dto/update-etablissement.dto';

@Injectable()
export class EtablissementService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createEtablissementDto: CreateEtablissementDto) {
    return this.prisma.etablissement.create({
      data: createEtablissementDto,
    });
  }

  async findAll() {
    return this.prisma.etablissement.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const etablissement = await this.prisma.etablissement.findUnique({
      where: { id },
    });
    if (!etablissement) {
      throw new NotFoundException(`Établissement avec ID ${id} non trouvé`);
    }
    return etablissement;
  }

  async update(id: string, updateEtablissementDto: UpdateEtablissementDto) {
    await this.findOne(id);
    return this.prisma.etablissement.update({
      where: { id },
      data: updateEtablissementDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.etablissement.delete({
      where: { id },
    });
  }
}

