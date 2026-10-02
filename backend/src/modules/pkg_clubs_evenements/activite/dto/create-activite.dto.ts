import { IsDateString, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";

export class CreateActiviteDto {
  @IsUUID()
  clubEvenementId: string;

  @IsString()
  @MaxLength(255)
  titre: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  dateActivite: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  lieu?: string;
}