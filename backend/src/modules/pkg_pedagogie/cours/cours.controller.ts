import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { CoursService } from './cours.service';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';

@Controller('cours')
export class CoursController {
  constructor(private readonly coursService: CoursService) {}

  @Post()
  create(@Req() req: any, @Body() createCourDto: CreateCourDto) {
    console.log("UTILISATEUR CONNECTÉ :", req.user);
    return this.coursService.create(req.user.sub, createCourDto);
  }

  @Get()
  findAll() {
    return this.coursService.findAll();
  }

  @Get('professeur/:professeurId')
  findByProfesseur(@Param('professeurId') professeurId: string) {
    return this.coursService.findByProfesseur(professeurId);
  }

  @Get('classe/:classeId')
  findByClasseId(@Param('classeId') classeId: string) {
    return this.coursService.findCoursByClasseId(classeId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coursService.findOne(id);
  }

  @Patch(':id')
  update(
    @Req() req: any,
    @Param('id') id: string,
    @Body() updateCourDto: UpdateCourDto,
  ) {
    return this.coursService.update(id, req.user.id, updateCourDto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.coursService.remove(id, req.user.id);
  }
}