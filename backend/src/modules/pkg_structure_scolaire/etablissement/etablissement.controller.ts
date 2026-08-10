import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { EtablissementService } from './etablissement.service';
import { CreateEtablissementDto } from './dto/create-etablissement.dto';
import { UpdateEtablissementDto } from './dto/update-etablissement.dto';

@ApiTags('Établissements')
@Controller('etablissement')
export class EtablissementController {
  constructor(private readonly etablissementService: EtablissementService) {}

  @Post()
  @ApiOperation({ summary: 'Créer un nouvel établissement' })
  create(@Body() createEtablissementDto: CreateEtablissementDto) {
    return this.etablissementService.create(createEtablissementDto);
  }

  @Get()
  @ApiOperation({ summary: 'Récupérer la liste de tous les établissements' })
  findAll() {
    return this.etablissementService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Récupérer un établissement par son ID (UUID)' })
  findOne(@Param('id') id: string) {
    return this.etablissementService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Mettre à jour un établissement' })
  update(
    @Param('id') id: string,
    @Body() updateEtablissementDto: UpdateEtablissementDto,
  ) {
    return this.etablissementService.update(id, updateEtablissementDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Supprimer un établissement' })
  remove(@Param('id') id: string) {
    return this.etablissementService.remove(id);
  }
}
