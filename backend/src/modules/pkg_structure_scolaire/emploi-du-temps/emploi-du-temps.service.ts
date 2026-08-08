import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEmploiDuTempDto } from './dto/create-emploi-du-temp.dto';
import { UpdateEmploiDuTempDto } from './dto/update-emploi-du-temp.dto';

@Injectable()
export class EmploiDuTempsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEmploiDuTempDto: CreateEmploiDuTempDto) {
    return this.prisma.emploiDuTemps.create({
      data: createEmploiDuTempDto as any,
    });
  }

  findAll() {
    return this.prisma.emploiDuTemps.findMany({
      include: {
        etablissement: true,
        classe: true,
        matiere: true,
        professeur: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.emploiDuTemps.findUnique({
      where: { id },
      include: {
        etablissement: true,
        classe: true,
        matiere: true,
        professeur: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Emploi du temps avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(id: string, updateEmploiDuTempDto: UpdateEmploiDuTempDto) {
    await this.findOne(id);
    return this.prisma.emploiDuTemps.update({
      where: { id },
      data: updateEmploiDuTempDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.emploiDuTemps.delete({ where: { id } });
  }
}
