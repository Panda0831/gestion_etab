import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateNiveauDto {
  @ApiProperty({ example: 'uuid-etablissement', description: 'ID de l\'établissement' })
  @IsUUID()
  @IsNotEmpty()
  etablissementId: string;

  @ApiProperty({ example: 'Terminale', description: 'Nom du niveau' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'TERM', description: 'Code du niveau' })
  @IsString()
  @IsNotEmpty()
  code: string;

  @ApiPropertyOptional({ example: 'Classe de terminale enseignement secondaire', description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;
}

