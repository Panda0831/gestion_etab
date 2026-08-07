import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceMinIoS3Service } from './service_min-io_s3.service';
import { CreateServiceMinIoS3Dto } from './dto/create-service_min-io_s3.dto';
import { UpdateServiceMinIoS3Dto } from './dto/update-service_min-io_s3.dto';

@Controller('service-min-io-s3')
export class ServiceMinIoS3Controller {
  constructor(private readonly serviceMinIoS3Service: ServiceMinIoS3Service) {}

  @Post()
  create(@Body() createServiceMinIoS3Dto: CreateServiceMinIoS3Dto) {
    return this.serviceMinIoS3Service.create(createServiceMinIoS3Dto);
  }

  @Get()
  findAll() {
    return this.serviceMinIoS3Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceMinIoS3Service.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceMinIoS3Dto: UpdateServiceMinIoS3Dto) {
    return this.serviceMinIoS3Service.update(+id, updateServiceMinIoS3Dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceMinIoS3Service.remove(+id);
  }
}
