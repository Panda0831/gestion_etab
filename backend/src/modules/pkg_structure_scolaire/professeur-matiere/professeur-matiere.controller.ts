import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProfesseurMatiereService } from './professeur-matiere.service';
import { CreateProfesseurMatiereDto } from './dto/create-professeur-matiere.dto';
import { UpdateProfesseurMatiereDto } from './dto/update-professeur-matiere.dto';

@Controller('professeur-matiere')
export class ProfesseurMatiereController {
  constructor(private readonly professeurMatiereService: ProfesseurMatiereService) {}

  @Post()
  create(@Body() createProfesseurMatiereDto: CreateProfesseurMatiereDto) {
    return this.professeurMatiereService.create(createProfesseurMatiereDto);
  }

  @Get()
  findAll() {
    return this.professeurMatiereService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.professeurMatiereService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProfesseurMatiereDto: UpdateProfesseurMatiereDto) {
    return this.professeurMatiereService.update(+id, updateProfesseurMatiereDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.professeurMatiereService.remove(+id);
  }
}
