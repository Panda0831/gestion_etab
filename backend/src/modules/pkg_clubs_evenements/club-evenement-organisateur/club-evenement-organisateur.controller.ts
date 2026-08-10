import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClubEvenementOrganisateurService } from './club-evenement-organisateur.service';
import { CreateClubEvenementOrganisateurDto } from './dto/create-club-evenement-organisateur.dto';
import { UpdateClubEvenementOrganisateurDto } from './dto/update-club-evenement-organisateur.dto';

@Controller('club-evenement-organisateur')
export class ClubEvenementOrganisateurController {
  constructor(
    private readonly clubEvenementOrganisateurService: ClubEvenementOrganisateurService,
  ) {}

  @Post()
  create(
    @Body()
    createClubEvenementOrganisateurDto: CreateClubEvenementOrganisateurDto,
  ) {
    return this.clubEvenementOrganisateurService.create(
      createClubEvenementOrganisateurDto,
    );
  }

  @Get()
  findAll() {
    return this.clubEvenementOrganisateurService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubEvenementOrganisateurService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    updateClubEvenementOrganisateurDto: UpdateClubEvenementOrganisateurDto,
  ) {
    return this.clubEvenementOrganisateurService.update(
      id,
      updateClubEvenementOrganisateurDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubEvenementOrganisateurService.remove(id);
  }
}
