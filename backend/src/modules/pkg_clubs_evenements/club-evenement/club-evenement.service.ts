import { Injectable } from '@nestjs/common';
import { CreateClubEvenementDto } from './dto/create-club-evenement.dto';
import { UpdateClubEvenementDto } from './dto/update-club-evenement.dto';

@Injectable()
export class ClubEvenementService {
  create(createClubEvenementDto: CreateClubEvenementDto) {
    return 'This action adds a new clubEvenement';
  }

  findAll() {
    return `This action returns all clubEvenement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clubEvenement`;
  }

  update(id: number, updateClubEvenementDto: UpdateClubEvenementDto) {
    return `This action updates a #${id} clubEvenement`;
  }

  remove(id: number) {
    return `This action removes a #${id} clubEvenement`;
  }
}
