import { PartialType } from '@nestjs/mapped-types';
import { CreateApiMvolaDto } from './create-api_mvola.dto';

export class UpdateApiMvolaDto extends PartialType(CreateApiMvolaDto) {}
