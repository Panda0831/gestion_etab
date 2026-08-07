import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiMvolaService } from './api_mvola.service';
import { CreateApiMvolaDto } from './dto/create-api_mvola.dto';
import { UpdateApiMvolaDto } from './dto/update-api_mvola.dto';

@Controller('api-mvola')
export class ApiMvolaController {
  constructor(private readonly apiMvolaService: ApiMvolaService) {}

  @Post()
  create(@Body() createApiMvolaDto: CreateApiMvolaDto) {
    return this.apiMvolaService.create(createApiMvolaDto);
  }

  @Get()
  findAll() {
    return this.apiMvolaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiMvolaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApiMvolaDto: UpdateApiMvolaDto) {
    return this.apiMvolaService.update(+id, updateApiMvolaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiMvolaService.remove(+id);
  }
}
