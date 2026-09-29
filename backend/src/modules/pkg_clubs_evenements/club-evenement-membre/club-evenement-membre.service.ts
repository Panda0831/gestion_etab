import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateClubEvenementMembreDto } from './dto/create-club-evenement-membre.dto';
import { UpdateClubEvenementMembreDto } from './dto/update-club-evenement-membre.dto';

@Injectable()
export class ClubEvenementMembreService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateClubEvenementMembreDto) {
    return this.prisma.clubEvenementMembre.create({
      data: { ...dto },
    });
  }

  findAll() {
    return this.prisma.clubEvenementMembre.findMany({
      include: {
        clubEvenement: true,
        utilisateur: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.clubEvenementMembre.findUnique({
      where: { id },
      include: {
        clubEvenement: true,
        utilisateur: true,
      },
    });
    if (!item) {
      throw new NotFoundException(
        `ClubEvenementMembre avec ID ${id} non trouvé`,
      );
    }
    return item;
  }

  async update(
    id: string,
    updateClubEvenementMembreDto: UpdateClubEvenementMembreDto,
  ) {
    await this.findOne(id);
    return this.prisma.clubEvenementMembre.update({
      where: { id },
      data: updateClubEvenementMembreDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.clubEvenementMembre.delete({ where: { id } });
  }
}
