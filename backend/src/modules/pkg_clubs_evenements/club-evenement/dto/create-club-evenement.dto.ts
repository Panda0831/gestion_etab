import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateClubEvenementDto {
  @IsString()
  nom: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsUUID()
  responsableId: string;
}