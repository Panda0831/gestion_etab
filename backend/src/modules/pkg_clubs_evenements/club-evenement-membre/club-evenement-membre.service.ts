import { Injectable } from '@nestjs/common';
import { CreateClubEvenementMembreDto } from './dto/create-club-evenement-membre.dto';
import { UpdateClubEvenementMembreDto } from './dto/update-club-evenement-membre.dto';

@Injectable()
export class ClubEvenementMembreService {
  create(createClubEvenementMembreDto: CreateClubEvenementMembreDto) {
    return 'This action adds a new clubEvenementMembre';
  }

  findAll() {
    return `This action returns all clubEvenementMembre`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clubEvenementMembre`;
  }

  update(id: number, updateClubEvenementMembreDto: UpdateClubEvenementMembreDto) {
    return `This action updates a #${id} clubEvenementMembre`;
  }

  remove(id: number) {
    return `This action removes a #${id} clubEvenementMembre`;
  }
}
