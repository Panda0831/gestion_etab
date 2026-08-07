import { PartialType } from '@nestjs/mapped-types';
import { CreateClubEvenementDto } from './create-club-evenement.dto';

export class UpdateClubEvenementDto extends PartialType(CreateClubEvenementDto) {}
