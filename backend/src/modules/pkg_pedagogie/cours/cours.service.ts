import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';

const PROFESSEUR_PUBLIC = { select: { id: true, nom: true, prenom: true } };
const MEDIAS_PUBLIC = { select: { id: true, nomFichier: true, type: true, url: true } };

@Injectable()
export class CoursService {
  constructor(private readonly prisma: PrismaService) {}

  create(professeurId: string, dto: CreateCourDto) {
    return this.prisma.cours.create({ data: { ...dto, professeurId } });
  }

  findAll() {
    return this.prisma.cours.findMany({
      include: {
        professeur: PROFESSEUR_PUBLIC,
        classe: true,
        matiere: true,
        medias: MEDIAS_PUBLIC,
      },
      orderBy: { datePublication: 'desc' },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.cours.findUnique({
      where: { id },
      include: {
        professeur: PROFESSEUR_PUBLIC,
        classe: true,
        matiere: true,
        medias: MEDIAS_PUBLIC,
      },
    });
    if (!item) {
      throw new NotFoundException(`Cours avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(id: string, professeurId: string, dto: UpdateCourDto) {
    await this.assertOwner(id, professeurId);
    return this.prisma.cours.update({ where: { id }, data: dto });
  }

  async remove(id: string, professeurId: string) {
    await this.assertOwner(id, professeurId);
    return this.prisma.cours.delete({ where: { id } });
  }

  findByProfesseur(professeurId: string) {
    return this.prisma.cours.findMany({
      where: { professeurId },
      include: {
        matiere: true,
        classe: { include: { niveau: true } },
        medias: MEDIAS_PUBLIC,
      },
      orderBy: { datePublication: 'desc' },
    });
  }

  findCoursByClasseId(classeId: string) {
    return this.prisma.cours.findMany({
      where: { classeId },
      include: {
        matiere: true,
        professeur: PROFESSEUR_PUBLIC,
        medias: MEDIAS_PUBLIC,
      },
      orderBy: { datePublication: 'desc' },
    });
  }

  // Vérifie que le cours existe et appartient bien au professeur connecté
  private async assertOwner(id: string, professeurId: string) {
    const cours = await this.prisma.cours.findUnique({ where: { id } });
    if (!cours) {
      throw new NotFoundException(`Cours avec ID ${id} non trouvé`);
    }
    if (cours.professeurId !== professeurId) {
      throw new ForbiddenException("Vous n'êtes pas l'auteur de ce cours");
    }
    return cours;
  }
}