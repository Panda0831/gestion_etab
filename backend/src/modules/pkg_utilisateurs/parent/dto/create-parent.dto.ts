import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateParentDto {
  @ApiProperty({ example: 'uuid-utilisateur', description: 'ID de l\'utilisateur parent' })
  @IsUUID()
  @IsNotEmpty()
  utilisateurId: string;

  @ApiPropertyOptional({ example: 'Commerçant', description: 'Profession du parent' })
  @IsOptional()
  @IsString()
  profession?: string;
}
