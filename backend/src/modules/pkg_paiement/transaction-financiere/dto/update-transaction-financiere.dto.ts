import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionFinanciereDto } from './create-transaction-financiere.dto';

export class UpdateTransactionFinanciereDto extends PartialType(
  CreateTransactionFinanciereDto,
) {}
