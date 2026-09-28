import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from "class-validator";
import { TypeCours } from "@prisma/client";

export class CreateCourDto {
  @IsUUID() classeId: string;
  @IsUUID() matiereId: string;
  @IsString() @IsNotEmpty() @MaxLength(255) titre: string;
  @IsOptional() @IsString() contenu?: string;
  @IsEnum(TypeCours) type: TypeCours;
}