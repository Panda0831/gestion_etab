import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateMatiereDto {
  @ApiProperty({ example: 'uuid-etablissement' })
  @IsUUID()
  @IsNotEmpty()
  etablissementId: string;

  @ApiProperty({ example: 'Mathématiques' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiPropertyOptional({ example: 'MATH' })
  @IsString()
  @IsOptional()
  code?: string;

  @ApiPropertyOptional({ example: 2, default: 1 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  coefficient?: number;
}
