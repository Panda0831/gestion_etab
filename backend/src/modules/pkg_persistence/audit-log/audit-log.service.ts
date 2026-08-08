import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateAuditLogDto } from './dto/create-audit-log.dto';
import { UpdateAuditLogDto } from './dto/update-audit-log.dto';

@Injectable()
export class AuditLogService {
  constructor(private readonly prisma: PrismaService) {}

  create(createAuditLogDto: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data: createAuditLogDto as any,
    });
  }

  findAll() {
    return this.prisma.auditLog.findMany({
      include: {
        utilisateur: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.auditLog.findUnique({
      where: { id },
      include: {
        utilisateur: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`AuditLog avec ID ${id} non trouvé`);
    }
    return item;
  }

  async update(id: string, updateAuditLogDto: UpdateAuditLogDto) {
    await this.findOne(id);
    return this.prisma.auditLog.update({
      where: { id },
      data: updateAuditLogDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.auditLog.delete({ where: { id } });
  }
}
