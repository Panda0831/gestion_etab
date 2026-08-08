import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';

@Injectable()
export class MessageService {
  constructor(private readonly prisma: PrismaService) {}

  create(createMessageDto: CreateMessageDto) {
    return this.prisma.message.create({
      data: createMessageDto as any,
    });
  }

  findAll() {
    return this.prisma.message.findMany({
      include: {
        discussion: true,
        expediteur: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.message.findUnique({
      where: { id },
      include: {
        discussion: true,
        expediteur: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Message avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(id: string, updateMessageDto: UpdateMessageDto) {
    await this.findOne(id);
    return this.prisma.message.update({
      where: { id },
      data: updateMessageDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.message.delete({ where: { id } });
  }
}
