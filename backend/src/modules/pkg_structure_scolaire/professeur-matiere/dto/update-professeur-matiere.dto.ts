import { PartialType } from '@nestjs/mapped-types';
import { CreateProfesseurMatiereDto } from './create-professeur-matiere.dto';

export class UpdateProfesseurMatiereDto extends PartialType(
  CreateProfesseurMatiereDto,
) {}
