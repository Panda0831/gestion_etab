import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateEvaluationDto } from './dto/create-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Injectable()
export class EvaluationService {
  constructor(private readonly prisma: PrismaService) {}

  create(createEvaluationDto: CreateEvaluationDto) {
    return this.prisma.evaluation.create({
      data: createEvaluationDto as any,
    });
  }

  findAll() {
    return this.prisma.evaluation.findMany({
      include: {
        matiere: true,
        classe: true,
        professeur: true,
        notes: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.evaluation.findUnique({
      where: { id },
      include: {
        matiere: true,
        classe: true,
        professeur: true,
        notes: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Évaluation avec ID ${id} non trouvée`);
    }
    return item;
  }

  async update(id: string, updateEvaluationDto: UpdateEvaluationDto) {
    await this.findOne(id);
    return this.prisma.evaluation.update({
      where: { id },
      data: updateEvaluationDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.evaluation.delete({ where: { id } });
  }
}
