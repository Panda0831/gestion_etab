import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CoursService } from './cours.service';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';

@Controller('cours')
export class CoursController {
  constructor(private readonly coursService: CoursService) {}

  @Post()
  create(@Req() req: any, @Body() createCourDto: CreateCourDto) {
    return this.coursService.create(req.user.sub, createCourDto);
  }

  @Post(':id/medias')
  @UseInterceptors(FilesInterceptor('files', 5, { limits: { fileSize: 100 * 1024 * 1024 } }))
  addMedias(
    @Req() req: any,
    @Param('id') id: string,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.coursService.addMedias(id, req.user.sub, files);
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
  update(@Req() req: any, @Param('id') id: string, @Body() updateCourDto: UpdateCourDto) {
    return this.coursService.update(id, req.user.id, updateCourDto);
  }

  @Delete(':id')
  remove(@Req() req: any, @Param('id') id: string) {
    return this.coursService.remove(id, req.user.id);
  }
}