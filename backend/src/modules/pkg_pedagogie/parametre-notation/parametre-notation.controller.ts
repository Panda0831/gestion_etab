import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ParametreNotationService } from './parametre-notation.service';
import { CreateParametreNotationDto } from './dto/create-parametre-notation.dto';
import { UpdateParametreNotationDto } from './dto/update-parametre-notation.dto';

@Controller('parametre-notation')
export class ParametreNotationController {
  constructor(private readonly parametreNotationService: ParametreNotationService) {}

  @Post()
  create(@Body() createParametreNotationDto: CreateParametreNotationDto) {
    return this.parametreNotationService.create(createParametreNotationDto);
  }

  @Get()
  findAll() {
    return this.parametreNotationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.parametreNotationService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateParametreNotationDto: UpdateParametreNotationDto) {
    return this.parametreNotationService.update(+id, updateParametreNotationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.parametreNotationService.remove(+id);
  }
}
