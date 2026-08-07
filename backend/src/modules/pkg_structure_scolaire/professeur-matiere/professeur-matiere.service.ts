import { Injectable } from '@nestjs/common';
import { CreateProfesseurMatiereDto } from './dto/create-professeur-matiere.dto';
import { UpdateProfesseurMatiereDto } from './dto/update-professeur-matiere.dto';

@Injectable()
export class ProfesseurMatiereService {
  create(createProfesseurMatiereDto: CreateProfesseurMatiereDto) {
    return 'This action adds a new professeurMatiere';
  }

  findAll() {
    return `This action returns all professeurMatiere`;
  }

  findOne(id: number) {
    return `This action returns a #${id} professeurMatiere`;
  }

  update(id: number, updateProfesseurMatiereDto: UpdateProfesseurMatiereDto) {
    return `This action updates a #${id} professeurMatiere`;
  }

  remove(id: number) {
    return `This action removes a #${id} professeurMatiere`;
  }
}
