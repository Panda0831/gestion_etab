import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

export class CreateClasseDto {
  @ApiProperty({ example: 'uuid-niveau' })
  @IsUUID()
  @IsNotEmpty()
  niveauId: string;

  @ApiProperty({ example: 'Terminale A' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: '2026-2027' })
  @IsString()
  @IsNotEmpty()
  anneeScolaire: string;

  @ApiPropertyOptional({ example: 32, default: 0 })
  @IsInt()
  @Min(0)
  @IsOptional()
  effectif?: number;
}
