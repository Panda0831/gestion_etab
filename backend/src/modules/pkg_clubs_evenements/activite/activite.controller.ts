import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ActiviteService } from './activite.service';
import { CreateActiviteDto } from './dto/create-activite.dto';
import { UpdateActiviteDto } from './dto/update-activite.dto';

@Controller('activite')
export class ActiviteController {
  constructor(private readonly activiteService: ActiviteService) {}

  @Post()
  create(@Body() createActiviteDto: CreateActiviteDto) {
    return this.activiteService.create(createActiviteDto);
  }

  @Get()
  findAll() {
    return this.activiteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.activiteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateActiviteDto: UpdateActiviteDto) {
    return this.activiteService.update(+id, updateActiviteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.activiteService.remove(+id);
  }
}
