import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceEmailDto } from './create-service_email.dto';

export class UpdateServiceEmailDto extends PartialType(CreateServiceEmailDto) {}
