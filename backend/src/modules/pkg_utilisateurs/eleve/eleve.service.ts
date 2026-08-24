import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEleveDto } from './dto/create-eleve.dto';
import { UpdateEleveDto } from './dto/update-eleve.dto';

@Injectable()
export class EleveService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEleveDto: CreateEleveDto) {
    return this.prisma.eleve.create({ data: createEleveDto });
  }

  async findAll(page: number = 1, limit: number = 2) {
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      this.prisma.eleve.findMany({
        skip,
        take: limit,
        include: { utilisateur: true, classe: true, parent: true },
        orderBy: { utilisateur: { nom: "asc" } }, // optionnel, pour un ordre stable
      }),
      this.prisma.eleve.count(),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const eleve = await this.prisma.eleve.findUnique({
      where: { id },
      include: { utilisateur: true, classe: true, parent: true },
    });
    if (!eleve) throw new NotFoundException(`Élève avec ID ${id} non trouvé`);
    return eleve;
  }

  async update(id: string, updateEleveDto: UpdateEleveDto) {
    await this.findOne(id);
    return this.prisma.eleve.update({ where: { id }, data: updateEleveDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.eleve.delete({ where: { id } });
  }
}
