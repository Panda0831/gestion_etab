import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ClubEvenementService } from './club-evenement.service';
import { CreateClubEvenementDto } from './dto/create-club-evenement.dto';
import { UpdateClubEvenementDto } from './dto/update-club-evenement.dto';

@Controller('club-evenement')
export class ClubEvenementController {
  constructor(private readonly clubEvenementService: ClubEvenementService) {}

  @Post()
  create(@Body() createClubEvenementDto: CreateClubEvenementDto) {
    return this.clubEvenementService.create(createClubEvenementDto);
  }

  @Get()
  findAll() {
    return this.clubEvenementService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.clubEvenementService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateClubEvenementDto: UpdateClubEvenementDto,
  ) {
    return this.clubEvenementService.update(id, updateClubEvenementDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.clubEvenementService.remove(id);
  }
}
