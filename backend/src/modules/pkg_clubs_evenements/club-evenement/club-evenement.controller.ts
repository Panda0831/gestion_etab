import {
  Body, Controller, Delete, ForbiddenException, Get, Param, Patch, Post, Req, UseGuards, Query,
} from '@nestjs/common';
import { ClubEvenementService } from './club-evenement.service';
import { CreateClubEvenementDto } from './dto/create-club-evenement.dto';
import { UpdateClubEvenementDto } from './dto/update-club-evenement.dto';
import { UpdateStatutClubDto } from './dto/update-statut-club.dto';

const secretaireSeulement = (req) => {
  if (req.user.role !== 'SECRETAIRE') throw new ForbiddenException();
};

@Controller('club-evenement')
export class ClubEvenementController {
  constructor(private readonly clubEvenementService: ClubEvenementService) {}

  @Post()
  create(@Body() dto: CreateClubEvenementDto, @Req() req) {
    return this.clubEvenementService.create(dto, req.user.etablissementId);
  }

  @Get()
  findAll(
    @Req() req,
    @Query('type') type?: 'CLUB' | 'EVENEMENT',
  ) {
    return this.clubEvenementService.findAll(req.user.etablissementId, type);
  }

  // Doit rester avant @Get(':id')
  @Get('demandes')
  findDemandes(@Req() req) {
    secretaireSeulement(req);
    return this.clubEvenementService.findDemandes(req.user.etablissementId);
  }

  // Doit rester avant @Get(':id')
  @Get('utilisateur/:utilisateurId')
  findByUtilisateur(
    @Param('utilisateurId') utilisateurId: string,
    @Query('type') type: 'CLUB' | 'EVENEMENT',
  ) {
    return this.clubEvenementService.findByUtilisateur(utilisateurId, type);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.clubEvenementService.findOne(id, req.user.etablissementId);
  }

  @Patch(':id/statut')
  changerStatut(@Param('id') id: string, @Body() dto: UpdateStatutClubDto, @Req() req) {
    secretaireSeulement(req);
    return this.clubEvenementService.changerStatut(id, req.user.etablissementId, dto.statut);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateClubEvenementDto, @Req() req) {
    return this.clubEvenementService.update(id, req.user.etablissementId, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.clubEvenementService.remove(id, req.user.etablissementId);
  }
}