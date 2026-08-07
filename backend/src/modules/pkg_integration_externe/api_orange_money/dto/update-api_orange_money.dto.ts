import { PartialType } from '@nestjs/mapped-types';
import { CreateApiOrangeMoneyDto } from './create-api_orange_money.dto';

export class UpdateApiOrangeMoneyDto extends PartialType(CreateApiOrangeMoneyDto) {}
