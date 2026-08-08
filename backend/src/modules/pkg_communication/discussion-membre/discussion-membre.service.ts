import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateDiscussionMembreDto } from './dto/create-discussion-membre.dto';
import { UpdateDiscussionMembreDto } from './dto/update-discussion-membre.dto';

@Injectable()
export class DiscussionMembreService {
  constructor(private readonly prisma: PrismaService) {}

  create(createDiscussionMembreDto: CreateDiscussionMembreDto) {
    return this.prisma.discussionMembre.create({
      data: createDiscussionMembreDto as any,
    });
  }

  findAll() {
    return this.prisma.discussionMembre.findMany({
      include: {
        discussion: true,
        utilisateur: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.discussionMembre.findUnique({
      where: { id },
      include: {
        discussion: true,
        utilisateur: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`DiscussionMembre avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(id: string, updateDiscussionMembreDto: UpdateDiscussionMembreDto) {
    await this.findOne(id);
    return this.prisma.discussionMembre.update({
      where: { id },
      data: updateDiscussionMembreDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.discussionMembre.delete({ where: { id } });
  }
}
