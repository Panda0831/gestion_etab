import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateUtilisateurDto } from './dto/create-utilisateur.dto';
import { UpdateUtilisateurDto } from './dto/update-utilisateur.dto';

@Injectable()
export class UtilisateurService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUtilisateurDto: CreateUtilisateurDto) {
    return this.prisma.utilisateur.create({
      data: createUtilisateurDto,
    });
  }

  async findAll() {
    return this.prisma.utilisateur.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        etablissement: {
          select: { id: true, nom: true, type: true },
        },
      },
    });
  }

  async findOne(id: string) {
    const utilisateur = await this.prisma.utilisateur.findUnique({
      where: { id },
      include: {
        etablissement: true,
        eleve: true,
        parent: true,
      },
    });
    if (!utilisateur) {
      throw new NotFoundException(`Utilisateur avec ID ${id} non trouvé`);
    }
    return utilisateur;
  }

  async update(id: string, updateUtilisateurDto: UpdateUtilisateurDto) {
    await this.findOne(id);
    return this.prisma.utilisateur.update({
      where: { id },
      data: updateUtilisateurDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.utilisateur.delete({
      where: { id },
    });
  }
}

