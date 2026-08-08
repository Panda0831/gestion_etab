import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateCoursMediaDto } from './dto/create-cours-media.dto';
import { UpdateCoursMediaDto } from './dto/update-cours-media.dto';

@Injectable()
export class CoursMediaService {
  constructor(private readonly prisma: PrismaService) {}

  create(createCoursMediaDto: CreateCoursMediaDto) {
    return this.prisma.coursMedia.create({
      data: createCoursMediaDto as any,
    });
  }

  findAll() {
    return this.prisma.coursMedia.findMany({
      include: {
        cours: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.coursMedia.findUnique({
      where: { id },
      include: {
        cours: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`CoursMedia avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(id: string, updateCoursMediaDto: UpdateCoursMediaDto) {
    await this.findOne(id);
    return this.prisma.coursMedia.update({
      where: { id },
      data: updateCoursMediaDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.coursMedia.delete({ where: { id } });
  }
}
