import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FournitureService } from './fourniture.service';
import { CreateFournitureDto } from './dto/create-fourniture.dto';
import { UpdateFournitureDto } from './dto/update-fourniture.dto';

@Controller('fourniture')
export class FournitureController {
  constructor(private readonly fournitureService: FournitureService) {}

  @Post()
  create(@Body() createFournitureDto: CreateFournitureDto) {
    return this.fournitureService.create(createFournitureDto);
  }

  @Get()
  findAll() {
    return this.fournitureService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fournitureService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFournitureDto: UpdateFournitureDto) {
    return this.fournitureService.update(id, updateFournitureDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fournitureService.remove(id);
  }
}
