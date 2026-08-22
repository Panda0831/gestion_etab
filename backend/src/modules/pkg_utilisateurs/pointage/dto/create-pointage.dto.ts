import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { StatutPointage } from '@prisma/client';

export class CreatePointageDto {
  @ApiProperty({ example: 'uuid-professeur' })
  @IsUUID()
  @IsNotEmpty()
  professeurId: string;

  @ApiProperty({ example: '2026-08-08' })
  @IsDateString()
  @IsNotEmpty()
  datePointage: string;

  @ApiPropertyOptional({ example: '2026-08-08T07:30:00.000Z' })
  @IsDateString()
  @IsOptional()
  heureArrivee?: string;

  @ApiPropertyOptional({ example: '2026-08-08T16:30:00.000Z' })
  @IsDateString()
  heureDepart?: string;

  @ApiPropertyOptional({
    enum: StatutPointage,
    example: StatutPointage.PRESENT,
  })
  @IsEnum(StatutPointage)
  @IsOptional()
  statut?: StatutPointage;
}
