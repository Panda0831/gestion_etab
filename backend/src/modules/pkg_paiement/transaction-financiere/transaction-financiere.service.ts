import { Injectable } from '@nestjs/common';
import { CreateTransactionFinanciereDto } from './dto/create-transaction-financiere.dto';
import { UpdateTransactionFinanciereDto } from './dto/update-transaction-financiere.dto';

@Injectable()
export class TransactionFinanciereService {
  create(createTransactionFinanciereDto: CreateTransactionFinanciereDto) {
    return 'This action adds a new transactionFinanciere';
  }

  findAll() {
    return `This action returns all transactionFinanciere`;
  }

  findOne(id: number) {
    return `This action returns a #${id} transactionFinanciere`;
  }

  update(id: number, updateTransactionFinanciereDto: UpdateTransactionFinanciereDto) {
    return `This action updates a #${id} transactionFinanciere`;
  }

  remove(id: number) {
    return `This action removes a #${id} transactionFinanciere`;
  }
}
