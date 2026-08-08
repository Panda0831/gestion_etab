import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CoursMediaService } from './cours-media.service';
import { CreateCoursMediaDto } from './dto/create-cours-media.dto';
import { UpdateCoursMediaDto } from './dto/update-cours-media.dto';

@Controller('cours-media')
export class CoursMediaController {
  constructor(private readonly coursMediaService: CoursMediaService) {}

  @Post()
  create(@Body() createCoursMediaDto: CreateCoursMediaDto) {
    return this.coursMediaService.create(createCoursMediaDto);
  }

  @Get()
  findAll() {
    return this.coursMediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursMediaService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoursMediaDto: UpdateCoursMediaDto) {
    return this.coursMediaService.update(id, updateCoursMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coursMediaService.remove(id);
  }
}
