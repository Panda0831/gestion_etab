import { Injectable } from '@nestjs/common';
import { CreateServiceMinIoS3Dto } from './dto/create-service_min-io_s3.dto';
import { UpdateServiceMinIoS3Dto } from './dto/update-service_min-io_s3.dto';

@Injectable()
export class ServiceMinIoS3Service {
  create(createServiceMinIoS3Dto: CreateServiceMinIoS3Dto) {
    return 'This action adds a new serviceMinIoS3';
  }

  findAll() {
    return `This action returns all serviceMinIoS3`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceMinIoS3`;
  }

  update(id: number, updateServiceMinIoS3Dto: UpdateServiceMinIoS3Dto) {
    return `This action updates a #${id} serviceMinIoS3`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceMinIoS3`;
  }
}
