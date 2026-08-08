import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNiveauDto {
  @ApiProperty({ example: 'uuid-etablissement', description: 'ID de l\'établissement' })
  @IsUUID()
  @IsNotEmpty()
  etablissementId: string;

  @ApiProperty({ example: 'Seconde', description: 'Nom du niveau' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiPropertyOptional({ example: 'LYCEE', description: 'Cycle' })
  @IsString()
  @IsOptional()
  cycle?: string;

  @ApiPropertyOptional({ example: 1, description: 'Ordre' })
  @IsInt()
  @IsOptional()
  ordre?: number;
}

