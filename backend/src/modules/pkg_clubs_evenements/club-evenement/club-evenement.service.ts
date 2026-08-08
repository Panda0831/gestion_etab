import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateClubEvenementDto } from './dto/create-club-evenement.dto';
import { UpdateClubEvenementDto } from './dto/update-club-evenement.dto';

@Injectable()
export class ClubEvenementService {
  constructor(private readonly prisma: PrismaService) {}

  create(createClubEvenementDto: CreateClubEvenementDto) {
    return this.prisma.clubEvenement.create({
      data: createClubEvenementDto as any,
    });
  }

  findAll() {
    return this.prisma.clubEvenement.findMany({
      include: {
        etablissement: true,
        responsable: true,
        activites: true,
        membres: { include: { eleve: { include: { utilisateur: true } } } },
        organisateurs: { include: { utilisateur: true } },
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.clubEvenement.findUnique({
      where: { id },
      include: {
        etablissement: true,
        responsable: true,
        activites: true,
        membres: { include: { eleve: { include: { utilisateur: true } } } },
        organisateurs: { include: { utilisateur: true } },
      },
    });
    if (!item) {
      throw new NotFoundException(`Club / Événement avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(id: string, updateClubEvenementDto: UpdateClubEvenementDto) {
    await this.findOne(id);
    return this.prisma.clubEvenement.update({
      where: { id },
      data: updateClubEvenementDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.clubEvenement.delete({ where: { id } });
  }
}
