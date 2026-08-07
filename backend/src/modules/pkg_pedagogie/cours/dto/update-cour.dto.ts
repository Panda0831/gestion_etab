import { PartialType } from '@nestjs/mapped-types';
import { CreateCourDto } from './create-cour.dto';

export class UpdateCourDto extends PartialType(CreateCourDto) {}
