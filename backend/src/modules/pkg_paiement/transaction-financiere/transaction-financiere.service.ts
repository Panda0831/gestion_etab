import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateTransactionFinanciereDto } from './dto/create-transaction-financiere.dto';
import { UpdateTransactionFinanciereDto } from './dto/update-transaction-financiere.dto';

@Injectable()
export class TransactionFinanciereService {
  constructor(private readonly prisma: PrismaService) {}

  create(createTransactionFinanciereDto: CreateTransactionFinanciereDto) {
    return this.prisma.transactionFinanciere.create({
      data: createTransactionFinanciereDto as any,
    });
  }

  findAll() {
    return this.prisma.transactionFinanciere.findMany({
      include: {
        eleve: { include: { utilisateur: true } },
        valideur: true,
      },
    });
  }

  async findOne(id: string) {
    const item = await this.prisma.transactionFinanciere.findUnique({
      where: { id },
      include: {
        eleve: { include: { utilisateur: true } },
        valideur: true,
      },
    });
    if (!item) {
      throw new NotFoundException(`Transaction financière avec ID ${id} non trouvée`);
    }
    return item;
  }

  async update(id: string, updateTransactionFinanciereDto: UpdateTransactionFinanciereDto) {
    await this.findOne(id);
    return this.prisma.transactionFinanciere.update({
      where: { id },
      data: updateTransactionFinanciereDto as any,
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    return this.prisma.transactionFinanciere.delete({ where: { id } });
  }
}
