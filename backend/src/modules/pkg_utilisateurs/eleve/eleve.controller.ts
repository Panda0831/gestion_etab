import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { EleveService } from './eleve.service';
import { CreateEleveDto } from './dto/create-eleve.dto';
import { UpdateEleveDto } from './dto/update-eleve.dto';

@Controller('eleve')
export class EleveController {
  constructor(private readonly eleveService: EleveService) {}

  @Post()
  create(@Body() createEleveDto: CreateEleveDto) {
    return this.eleveService.create(createEleveDto);
  }

  @Get()
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('search') search?: string,
    @Query('classeId') classeId?: string,
    @Query('statutInscription') statutInscription?: string,
  ) {
    return this.eleveService.findAll(
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 6,
      search,
      classeId,
      statutInscription,
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eleveService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEleveDto: UpdateEleveDto) {
    return this.eleveService.update(id, updateEleveDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eleveService.remove(id);
  }
}
