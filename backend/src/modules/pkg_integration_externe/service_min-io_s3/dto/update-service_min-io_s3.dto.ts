import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceMinIoS3Dto } from './create-service_min-io_s3.dto';

export class UpdateServiceMinIoS3Dto extends PartialType(CreateServiceMinIoS3Dto) {}
