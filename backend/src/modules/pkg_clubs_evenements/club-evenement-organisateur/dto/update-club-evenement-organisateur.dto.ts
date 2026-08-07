import { PartialType } from '@nestjs/mapped-types';
import { CreateClubEvenementOrganisateurDto } from './create-club-evenement-organisateur.dto';

export class UpdateClubEvenementOrganisateurDto extends PartialType(CreateClubEvenementOrganisateurDto) {}
