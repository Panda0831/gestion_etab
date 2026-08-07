import { PartialType } from '@nestjs/mapped-types';
import { CreateFournitureDto } from './create-fourniture.dto';

export class UpdateFournitureDto extends PartialType(CreateFournitureDto) {}
