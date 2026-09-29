import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateClubEvenementDto } from './dto/create-club-evenement.dto';
import { UpdateClubEvenementDto } from './dto/update-club-evenement.dto';

// Champs utilisateur exposés (jamais le hash du mot de passe)
const userSafe = { select: { id: true, nom: true, prenom: true } };

const include = {
  etablissement: true,
  responsable: userSafe,
  activites: true,
  membres: { include: { utilisateur: userSafe } },
  organisateurs: { include: { utilisateur: userSafe } },
};

@Injectable()
export class ClubEvenementService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateClubEvenementDto, etablissementId: string) {
    return this.prisma.clubEvenement.create({
      data: { ...dto, type: 'CLUB', etablissementId },
    });
  }

  findAll(etablissementId: string) {
    return this.prisma.clubEvenement.findMany({
      where: { etablissementId },
      include,
    });
  }

  async findOne(id: string, etablissementId: string) {
    const item = await this.prisma.clubEvenement.findFirst({
      where: { id, etablissementId },
      include,
    });
    if (!item) {
      throw new NotFoundException(`Club / Événement avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(id: string, etablissementId: string, dto: UpdateClubEvenementDto) {
    await this.findOne(id, etablissementId);
    return this.prisma.clubEvenement.update({ where: { id }, data: dto });
  }

  async remove(id: string, etablissementId: string) {
    await this.findOne(id, etablissementId);
    return this.prisma.clubEvenement.delete({ where: { id } });
  }

  // Demandes de clubs en attente de validation
  findDemandes(etablissementId: string) {
    return this.prisma.clubEvenement.findMany({
      where: { etablissementId, type: 'CLUB', statut: 'EN_PREPARATION' },
      select: {
        id: true,
        nom: true,
        description: true,
        responsable: userSafe,
      },
    });
  }

  async changerStatut(id: string, etablissementId: string, statut: 'VALIDE' | 'ANNULE') {
    await this.findOne(id, etablissementId);
    return this.prisma.clubEvenement.update({ where: { id }, data: { statut } });
  }

  async findByUtilisateur(utilisateurId: string, type: 'CLUB' | 'EVENEMENT') {
    return this.prisma.clubEvenement.findMany({
      where: {
        type: type, // Filtre par type : 'CLUB' ou 'EVENEMENT'
        OR: [
          // Condition 1 : L'utilisateur est le responsable (créateur)
          { responsableId: utilisateurId },
          
          // Condition 2 : L'utilisateur fait partie des membres
          {
            membres: {
              some: {
                utilisateurId: utilisateurId,
              },
            },
          },
        ],
      },
      include: {
        responsable: {
          select: { id: true, nom: true, prenom: true },
        },
        membres: {
          where: {
            utilisateurId: utilisateurId, // Permet de récupérer son rôle spécifique dans le club
          },
        },
      },
    });
  } 
}