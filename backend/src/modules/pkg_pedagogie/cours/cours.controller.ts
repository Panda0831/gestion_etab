import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoursService } from './cours.service';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';

@Controller('cours')
export class CoursController {
  constructor(private readonly coursService: CoursService) {}

  @Post()
  create(@Body() createCourDto: CreateCourDto) {
    return this.coursService.create(createCourDto);
  }

  @Get()
  findAll() {
    return this.coursService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCourDto: UpdateCourDto) {
    return this.coursService.update(+id, updateCourDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursService.remove(+id);
  }
}
