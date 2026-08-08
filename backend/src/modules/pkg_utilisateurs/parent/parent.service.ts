import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateParentDto } from './dto/create-parent.dto';
import { UpdateParentDto } from './dto/update-parent.dto';

@Injectable()
export class ParentService {
  constructor(private readonly prisma: PrismaService) {}

  create(createParentDto: CreateParentDto) {
    return this.prisma.parent.create({ data: createParentDto });
  }

  findAll() {
    return this.prisma.parent.findMany({
      include: { utilisateur: true, enfants: true },
    });
  }

  async findOne(id: string) {
    const parent = await this.prisma.parent.findUnique({
      where: { id },
      include: { utilisateur: true, enfants: true },
    });
    if (!parent) throw new NotFoundException(`Parent avec ID ${id} non trouvé`);
    return parent;
  }

  async update(id: string, updateParentDto: UpdateParentDto) {
    await this.findOne(id);
    return this.prisma.parent.update({ where: { id }, data: updateParentDto });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.parent.delete({ where: { id } });
  }
}
