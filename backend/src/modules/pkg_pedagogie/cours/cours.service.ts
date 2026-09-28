import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { TypeMedia } from '@prisma/client';
import { randomUUID } from 'crypto';
import { extname } from 'path';
import { PrismaService } from '../../../prisma/prisma.service';
import { MinioService } from '../../../storage/minio.service'; // adapte le chemin
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';

const PROFESSEUR_PUBLIC = { select: { id: true, nom: true, prenom: true } };
const MEDIAS_PUBLIC = { select: { id: true, nomFichier: true, type: true, url: true } };

const MEDIA_TYPES: [string, TypeMedia][] = [
  ['image/', 'IMAGE'],
  ['video/', 'VIDEO'],
  ['audio/', 'AUDIO'],
  ['application/pdf', 'PDF'],
];

@Injectable()
export class CoursService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
  ) {}

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
    if (!item) throw new NotFoundException(`Cours avec ID ${id} non trouvé`);
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

  async addMedias(coursId: string, professeurId: string, files: Express.Multer.File[]) {
    await this.assertOwner(coursId, professeurId);
    if (!files?.length) throw new BadRequestException('Aucun fichier reçu');

    // On valide tout avant d'envoyer quoi que ce soit
    const items = files.map((file) => {
      const type = MEDIA_TYPES.find(([prefix]) => file.mimetype.startsWith(prefix))?.[1];
      if (!type) throw new BadRequestException(`Format non supporté : ${file.originalname}`);
      return { file, type };
    });

    return Promise.all(
      items.map(async ({ file, type }) => {
        const key = `cours/${coursId}/${randomUUID()}${extname(file.originalname).toLowerCase()}`;
        const url = await this.minio.upload(key, file);
        return this.prisma.coursMedia.create({
          data: {
            coursId,
            // Multer décode les noms UTF-8 en latin1 : on corrige les accents
            nomFichier: Buffer.from(file.originalname, 'latin1').toString('utf8'),
            type,
            url,
            taille: BigInt(file.size),
          },
          select: { id: true, nomFichier: true, type: true, url: true }, // sans taille (BigInt)
        });
      }),
    );
  }

  async removeMedia(coursId: string, mediaId: string, professeurId: string) {
    await this.assertOwner(coursId, professeurId);
    const media = await this.prisma.coursMedia.findUnique({ where: { id: mediaId } });
    if (!media || media.coursId !== coursId) {
      throw new NotFoundException('Média introuvable pour ce cours');
    }
    await this.minio.deleteByUrl(media.url);
    await this.prisma.coursMedia.delete({ where: { id: mediaId } });
    return { deleted: true };
  }

  // Vérifie que le cours existe et appartient au professeur connecté
  private async assertOwner(id: string, professeurId: string) {
    const cours = await this.prisma.cours.findUnique({ where: { id } });
    if (!cours) throw new NotFoundException(`Cours avec ID ${id} non trouvé`);
    if (cours.professeurId !== professeurId) {
      console.log(`Cours ${id} appartient à ${cours.professeurId}, pas à ${professeurId}`);
      throw new ForbiddenException("Vous n'êtes pas l'auteur de ce cours");
    }
    return cours;
  }


}