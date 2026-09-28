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

  async findAll(
    page: number = 1,
    limit: number = 6,
    search?: string,
    classeId?: string,
    statutInscription?: string,
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.utilisateur = {
        OR: [
          { nom: { contains: search, mode: "insensitive" } },
          { prenom: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ],
      };
    }

    if (classeId) {
      where.classeId = classeId;
    }

    if (statutInscription) {
      where.statutInscription = statutInscription;
    }

    const [data, total] = await Promise.all([
      this.prisma.eleve.findMany({
        where,
        skip,
        take: limit,
        include: { utilisateur: true, classe: true, parent: true },
        orderBy: { utilisateur: { nom: "asc" } },
      }),
      this.prisma.eleve.count({ where }),
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

   async findByUserId(userId: string) {
    const eleve = await this.prisma.eleve.findUnique({
      where: { utilisateurId: userId },
      include: { classe: { include: { niveau: true } } },
    });
    if (!eleve) throw new NotFoundException(`Aucun élève pour l'utilisateur ${userId}`);
    return eleve;
  }
}
