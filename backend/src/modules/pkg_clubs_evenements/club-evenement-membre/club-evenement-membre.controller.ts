import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ClubEvenementMembreService } from './club-evenement-membre.service';
import { CreateClubEvenementMembreDto } from './dto/create-club-evenement-membre.dto';
import { UpdateClubEvenementMembreDto } from './dto/update-club-evenement-membre.dto';

@Controller('club-evenement-membre')
export class ClubEvenementMembreController {
  constructor(private readonly clubEvenementMembreService: ClubEvenementMembreService) {}

  @Post()
  create(@Body() createClubEvenementMembreDto: CreateClubEvenementMembreDto) {
    return this.clubEvenementMembreService.create(createClubEvenementMembreDto);
  }

  @Get()
  findAll() {
    return this.clubEvenementMembreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubEvenementMembreService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateClubEvenementMembreDto: UpdateClubEvenementMembreDto) {
    return this.clubEvenementMembreService.update(id, updateClubEvenementMembreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubEvenementMembreService.remove(id);
  }
}
