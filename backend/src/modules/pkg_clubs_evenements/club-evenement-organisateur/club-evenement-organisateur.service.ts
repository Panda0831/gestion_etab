import { Injectable } from '@nestjs/common';
import { CreateClubEvenementOrganisateurDto } from './dto/create-club-evenement-organisateur.dto';
import { UpdateClubEvenementOrganisateurDto } from './dto/update-club-evenement-organisateur.dto';

@Injectable()
export class ClubEvenementOrganisateurService {
  create(createClubEvenementOrganisateurDto: CreateClubEvenementOrganisateurDto) {
    return 'This action adds a new clubEvenementOrganisateur';
  }

  findAll() {
    return `This action returns all clubEvenementOrganisateur`;
  }

  findOne(id: number) {
    return `This action returns a #${id} clubEvenementOrganisateur`;
  }

  update(id: number, updateClubEvenementOrganisateurDto: UpdateClubEvenementOrganisateurDto) {
    return `This action updates a #${id} clubEvenementOrganisateur`;
  }

  remove(id: number) {
    return `This action removes a #${id} clubEvenementOrganisateur`;
  }
}
