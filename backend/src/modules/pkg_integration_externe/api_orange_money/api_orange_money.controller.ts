import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOrangeMoneyService } from './api_orange_money.service';
import { CreateApiOrangeMoneyDto } from './dto/create-api_orange_money.dto';
import { UpdateApiOrangeMoneyDto } from './dto/update-api_orange_money.dto';

@Controller('api-orange-money')
export class ApiOrangeMoneyController {
  constructor(private readonly apiOrangeMoneyService: ApiOrangeMoneyService) {}

  @Post()
  create(@Body() createApiOrangeMoneyDto: CreateApiOrangeMoneyDto) {
    return this.apiOrangeMoneyService.create(createApiOrangeMoneyDto);
  }

  @Get()
  findAll() {
    return this.apiOrangeMoneyService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.apiOrangeMoneyService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateApiOrangeMoneyDto: UpdateApiOrangeMoneyDto) {
    return this.apiOrangeMoneyService.update(+id, updateApiOrangeMoneyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.apiOrangeMoneyService.remove(+id);
  }
}
