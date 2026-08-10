import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateProfesseurMatiereDto } from './dto/create-professeur-matiere.dto';
import { UpdateProfesseurMatiereDto } from './dto/update-professeur-matiere.dto';

@Injectable()
export class ProfesseurMatiereService {
  constructor(private readonly prisma: PrismaService) {}

  create(createProfesseurMatiereDto: CreateProfesseurMatiereDto) {
    return this.prisma.professeurMatiere.create({
      data: createProfesseurMatiereDto as any,
    });
  }

  findAll() {
    return this.prisma.professeurMatiere.findMany({
      include: {
        professeur: true,
        matiere: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.professeurMatiere.findUnique({
      where: { id },
      include: {
        professeur: true,
        matiere: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`ProfesseurMatiere avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(
    id: string,
    updateProfesseurMatiereDto: UpdateProfesseurMatiereDto,
  ) {
    await this.findOne(id);
    return this.prisma.professeurMatiere.update({
      where: { id },
      data: updateProfesseurMatiereDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.professeurMatiere.delete({ where: { id } });
  }
}
