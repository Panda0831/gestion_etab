import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { Sexe, StatutInscription } from '@prisma/client';

export class CreateEleveDto {
  @ApiProperty({ example: 'uuid-utilisateur' })
  @IsUUID()
  @IsNotEmpty()
  utilisateurId: string;

  @ApiPropertyOptional({ example: 'uuid-classe' })
  @IsUUID()
  @IsOptional()
  classeId?: string;

  @ApiPropertyOptional({ example: 'uuid-parent' })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiProperty({ example: '2026-001' })
  @IsString()
  @IsNotEmpty()
  matricule: string;

  @ApiPropertyOptional({ example: '2010-05-20' })
  @IsDateString()
  @IsOptional()
  dateNaissance?: string;

  @ApiPropertyOptional({ example: 'Antananarivo' })
  @IsString()
  @IsOptional()
  lieuNaissance?: string;

  @ApiPropertyOptional({ enum: Sexe, example: Sexe.F })
  @IsEnum(Sexe)
  @IsOptional()
  sexe?: Sexe;

  @ApiPropertyOptional({ enum: StatutInscription, example: StatutInscription.INSCRIT })
  @IsEnum(StatutInscription)
  @IsOptional()
  statutInscription?: StatutInscription;
}
