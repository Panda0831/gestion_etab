import { PartialType } from '@nestjs/mapped-types';
import { CreateClubEvenementMembreDto } from './create-club-evenement-membre.dto';

export class UpdateClubEvenementMembreDto extends PartialType(
  CreateClubEvenementMembreDto,
) {}
