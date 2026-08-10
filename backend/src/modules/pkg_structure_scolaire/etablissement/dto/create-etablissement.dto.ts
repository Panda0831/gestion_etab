import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { TypeEtablissement } from '@prisma/client';

export class CreateEtablissementDto {
  @ApiProperty({
    example: 'Lycée Jules Ferry',
    description: "Nom de l'établissement",
  })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiPropertyOptional({
    example: '123 Rue de la République',
    description: 'Adresse',
  })
  @IsString()
  @IsOptional()
  adresse?: string;

  @ApiPropertyOptional({
    example: '+261 34 00 000 00',
    description: 'Téléphone',
  })
  @IsString()
  @IsOptional()
  telephone?: string;

  @ApiPropertyOptional({
    example: 'contact@lycee.ed',
    description: 'Adresse email unique',
  })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/logo.png',
    description: 'URL du logo',
  })
  @IsString()
  @IsOptional()
  logo?: string;

  @ApiProperty({
    enum: TypeEtablissement,
    example: TypeEtablissement.LYCEE,
    description: "Type d'établissement",
  })
  @IsEnum(TypeEtablissement)
  type: TypeEtablissement;
}
