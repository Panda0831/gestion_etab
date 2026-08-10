import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'jean.dupont@example.com',
    description: "Email de l'utilisateur",
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'motdepasse123', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty()
  motDePasse: string;

  @ApiPropertyOptional({
    example: 'uuid-etablissement',
    description:
      "ID de l'établissement (requis si l'email existe sur plusieurs établissements)",
  })
  @IsUUID()
  @IsOptional()
  etablissementId?: string;
}
