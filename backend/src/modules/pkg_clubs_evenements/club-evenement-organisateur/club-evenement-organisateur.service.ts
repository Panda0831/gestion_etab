import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateClubEvenementOrganisateurDto } from './dto/create-club-evenement-organisateur.dto';
import { UpdateClubEvenementOrganisateurDto } from './dto/update-club-evenement-organisateur.dto';

@Injectable()
export class ClubEvenementOrganisateurService {
  constructor(private readonly prisma: PrismaService) {}

  create(createClubEvenementOrganisateurDto: CreateClubEvenementOrganisateurDto) {
    return this.prisma.clubEvenementOrganisateur.create({
      data: createClubEvenementOrganisateurDto as any,
    });
  }

  findAll() {
    return this.prisma.clubEvenementOrganisateur.findMany({
      include: {
        clubEvenement: true,
        utilisateur: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.clubEvenementOrganisateur.findUnique({
      where: { id },
      include: {
        clubEvenement: true,
        utilisateur: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`ClubEvenementOrganisateur avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(id: string, updateClubEvenementOrganisateurDto: UpdateClubEvenementOrganisateurDto) {
    await this.findOne(id);
    return this.prisma.clubEvenementOrganisateur.update({
      where: { id },
      data: updateClubEvenementOrganisateurDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.clubEvenementOrganisateur.delete({ where: { id } });
  }
}
