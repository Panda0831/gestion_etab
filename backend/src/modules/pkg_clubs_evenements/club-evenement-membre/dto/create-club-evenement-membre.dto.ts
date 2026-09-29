import { IsNotEmpty, IsOptional, IsString, IsEnum, IsDateString } from 'class-validator';
import { RoleMembre } from '@prisma/client';

export class CreateClubEvenementMembreDto {
  @IsString()
  @IsNotEmpty()
  clubEvenementId: string;

  @IsString()
  @IsNotEmpty()
  utilisateurId: string;

  @IsEnum(RoleMembre)
  @IsOptional()
  role?: RoleMembre;

  @IsDateString()
  @IsOptional()
  dateAdhesion?: string;
}