import { PartialType } from '@nestjs/mapped-types';
import { CreateParametreNotationDto } from './create-parametre-notation.dto';

export class UpdateParametreNotationDto extends PartialType(
  CreateParametreNotationDto,
) {}
