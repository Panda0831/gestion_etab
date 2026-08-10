import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TransactionFinanciereService } from './transaction-financiere.service';
import { CreateTransactionFinanciereDto } from './dto/create-transaction-financiere.dto';
import { UpdateTransactionFinanciereDto } from './dto/update-transaction-financiere.dto';

@Controller('transaction-financiere')
export class TransactionFinanciereController {
  constructor(
    private readonly transactionFinanciereService: TransactionFinanciereService,
  ) {}

  @Post()
  create(
    @Body() createTransactionFinanciereDto: CreateTransactionFinanciereDto,
  ) {
    return this.transactionFinanciereService.create(
      createTransactionFinanciereDto,
    );
  }

  @Get()
  findAll() {
    return this.transactionFinanciereService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionFinanciereService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTransactionFinanciereDto: UpdateTransactionFinanciereDto,
  ) {
    return this.transactionFinanciereService.update(
      id,
      updateTransactionFinanciereDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.transactionFinanciereService.remove(id);
  }
}
