import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';

@Injectable()
export class NoteService {
  constructor(private readonly prisma: PrismaService) {}

  create(createNoteDto: CreateNoteDto) {
    return this.prisma.note.create({
      data: createNoteDto as any,
    });
  }

  findAll() {
    return this.prisma.note.findMany({
      include: {
        evaluation: true,
        eleve: { include: { utilisateur: true } },
        auteurSaisie: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.note.findUnique({
      where: { id },
      include: {
        evaluation: true,
        eleve: { include: { utilisateur: true } },
        auteurSaisie: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Note avec ID ${id} non trouvée`);
    }
    return item;
  }

  async update(id: string, updateNoteDto: UpdateNoteDto) {
    await this.findOne(id);
    return this.prisma.note.update({
      where: { id },
      data: updateNoteDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.note.delete({ where: { id } });
  }
}
