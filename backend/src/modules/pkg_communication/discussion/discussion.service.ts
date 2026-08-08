import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';

@Injectable()
export class DiscussionService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDiscussionDto: CreateDiscussionDto) {
    return this.prisma.discussion.create({
      data: createDiscussionDto as any,
    });
  }

  findAll() {
    return this.prisma.discussion.findMany({
      include: {
        membres: { include: { utilisateur: true } },
        messages: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.discussion.findUnique({
      where: { id },
      include: {
        membres: { include: { utilisateur: true } },
        messages: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Discussion avec ID ${id} non trouvée`);
    }
    return item;
  }

  async update(id: string, updateDiscussionDto: UpdateDiscussionDto) {
    await this.findOne(id);
    return this.prisma.discussion.update({
      where: { id },
      data: updateDiscussionDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.discussion.delete({ where: { id } });
  }
}
