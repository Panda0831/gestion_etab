import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';

@Injectable()
export class CoursService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCourDto: CreateCourDto) {
    return this.prisma.cours.create({
      data: createCourDto as any,
    });
  }

  findAll() {
    return this.prisma.cours.findMany({
      include: {
        professeur: true,
        classe: true,
        matiere: true,
        medias: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.cours.findUnique({
      where: { id },
      include: {
        professeur: true,
        classe: true,
        matiere: true,
        medias: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Cours avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(id: string, updateCourDto: UpdateCourDto) {
    await this.findOne(id);
    return this.prisma.cours.update({
      where: { id },
      data: updateCourDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.cours.delete({ where: { id } });
  }

  async findByProfesseur(professeurId: string) {
    return this.prisma.cours.findMany({
      where: { professeurId },
      include: {
        matiere: true,
        classe: { include: { niveau: true } },
        medias: { select: { id: true, nomFichier: true, type: true, url: true } },
      },
      orderBy: { datePublication: "desc" },
    });
  }

  async findCoursByClasseId(classeId: string) {
    return this.prisma.cours.findMany({
      where: { classeId },
      include: {
        matiere: true,
        professeur: { select: { nom: true, prenom: true } },
        medias: {
          select: { id: true, nomFichier: true, type: true, url: true },
        },
      },
      orderBy: { datePublication: "desc" },
    });
  }

  
}
