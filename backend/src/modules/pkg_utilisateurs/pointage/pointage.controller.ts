import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PointageService } from './pointage.service';
import { CreatePointageDto } from './dto/create-pointage.dto';
import { UpdatePointageDto } from './dto/update-pointage.dto';

@Controller('pointage')
export class PointageController {
  constructor(private readonly pointageService: PointageService) {}

  @Post()
  create(@Body() createPointageDto: CreatePointageDto) {
    return this.pointageService.create(createPointageDto);
  }

  @Get()
  findAll() {
    return this.pointageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.pointageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePointageDto: UpdatePointageDto) {
    return this.pointageService.update(id, updatePointageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.pointageService.remove(id);
  }
}
