import { IsIn } from 'class-validator';

export class UpdateStatutClubDto {
  @IsIn(['VALIDE', 'ANNULE'])
  statut: 'VALIDE' | 'ANNULE';
}