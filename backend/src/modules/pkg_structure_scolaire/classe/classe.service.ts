import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateClasseDto } from './dto/create-classe.dto';
import { UpdateClasseDto } from './dto/update-classe.dto';

@Injectable()
export class ClasseService {
  constructor(private readonly prisma: PrismaService) {}

  create(createClasseDto: CreateClasseDto) {
    return this.prisma.classe.create({ data: createClasseDto });
  }

  findAll() {
    return this.prisma.classe.findMany({ include: { niveau: true } });
  }

  async findOne(id: string) {
    const classe = await this.prisma.classe.findUnique({
      where: { id },
      include: { niveau: true },
    });
    if (!classe)
      throw new NotFoundException(`Classe avec ID ${id} non trouvée`);
    return classe;
  }

  async update(id: string, updateClasseDto: UpdateClasseDto) {
    await this.findOne(id);
    return this.prisma.classe.update({ where: { id }, data: updateClasseDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.classe.delete({ where: { id } });
  }
}
