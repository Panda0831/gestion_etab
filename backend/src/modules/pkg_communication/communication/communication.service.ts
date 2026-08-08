import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCommunicationDto } from './dto/create-communication.dto';
import { UpdateCommunicationDto } from './dto/update-communication.dto';

@Injectable()
export class CommunicationService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCommunicationDto: CreateCommunicationDto) {
    return this.prisma.communication.create({
      data: createCommunicationDto as any,
    });
  }

  findAll() {
    return this.prisma.communication.findMany({
      include: {
        etablissement: true,
        auteur: true,
        destinataire: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.communication.findUnique({
      where: { id },
      include: {
        etablissement: true,
        auteur: true,
        destinataire: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Communication avec ID ${id} non trouvée`);
    }
    return item;
  }

  async update(id: string, updateCommunicationDto: UpdateCommunicationDto) {
    await this.findOne(id);
    return this.prisma.communication.update({
      where: { id },
      data: updateCommunicationDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.communication.delete({ where: { id } });
  }
}
