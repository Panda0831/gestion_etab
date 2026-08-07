import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ServiceEmailService } from './service_email.service';
import { CreateServiceEmailDto } from './dto/create-service_email.dto';
import { UpdateServiceEmailDto } from './dto/update-service_email.dto';

@Controller('service-email')
export class ServiceEmailController {
  constructor(private readonly serviceEmailService: ServiceEmailService) {}

  @Post()
  create(@Body() createServiceEmailDto: CreateServiceEmailDto) {
    return this.serviceEmailService.create(createServiceEmailDto);
  }

  @Get()
  findAll() {
    return this.serviceEmailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.serviceEmailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateServiceEmailDto: UpdateServiceEmailDto) {
    return this.serviceEmailService.update(+id, updateServiceEmailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.serviceEmailService.remove(+id);
  }
}
