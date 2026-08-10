import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { RoleUtilisateur } from '@prisma/client';

export class CreateUtilisateurDto {
  @ApiProperty({
    example: 'uuid-etablissement',
    description: "ID de l'établissement (UUID)",
  })
  @IsUUID()
  @IsNotEmpty()
  etablissementId: string;

  @ApiProperty({
    example: 'jean.dupont@example.com',
    description: 'Email unique par établissement',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'motdepasse123', description: 'Mot de passe' })
  @IsString()
  @IsNotEmpty()
  motDePasse: string;

  @ApiProperty({ example: 'Dupont', description: 'Nom' })
  @IsString()
  @IsNotEmpty()
  nom: string;

  @ApiProperty({ example: 'Jean', description: 'Prénom' })
  @IsString()
  @IsNotEmpty()
  prenom: string;

  @ApiPropertyOptional({
    example: '+261 34 11 222 33',
    description: 'Numéro de téléphone',
  })
  @IsString()
  @IsOptional()
  telephone?: string;

  @ApiProperty({
    enum: RoleUtilisateur,
    example: RoleUtilisateur.PROFESSEUR,
    description: "Rôle de l'utilisateur",
  })
  @IsEnum(RoleUtilisateur)
  role: RoleUtilisateur;
}
