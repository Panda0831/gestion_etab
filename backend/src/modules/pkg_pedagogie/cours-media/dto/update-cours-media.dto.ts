import { PartialType } from '@nestjs/mapped-types';
import { CreateCoursMediaDto } from './create-cours-media.dto';

export class UpdateCoursMediaDto extends PartialType(CreateCoursMediaDto) {}
