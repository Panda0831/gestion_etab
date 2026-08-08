import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { NiveauService } from './niveau.service';
import { CreateNiveauDto } from './dto/create-niveau.dto';
import { UpdateNiveauDto } from './dto/update-niveau.dto';

@ApiTags('Niveaux scolaires')
@Controller('niveau')
export class NiveauController {
  constructor(private readonly niveauService: NiveauService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouveau niveau scolaire' })
  create(@Body() createNiveauDto: CreateNiveauDto) {
    return this.niveauService.create(createNiveauDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer tous les niveaux scolaires' })
  findAll() {
    return this.niveauService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un niveau par son ID (UUID)' })
  findOne(@Param('id') id: string) {
    return this.niveauService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un niveau' })
  update(@Param('id') id: string, @Body() updateNiveauDto: UpdateNiveauDto) {
    return this.niveauService.update(id, updateNiveauDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un niveau' })
  remove(@Param('id') id: string) {
    return this.niveauService.remove(id);
  }
}

