import { Injectable } from '@nestjs/common';
import { CreateParametreNotationDto } from './dto/create-parametre-notation.dto';
import { UpdateParametreNotationDto } from './dto/update-parametre-notation.dto';

@Injectable()
export class ParametreNotationService {
  create(createParametreNotationDto: CreateParametreNotationDto) {
    return 'This action adds a new parametreNotation';
  }

  findAll() {
    return `This action returns all parametreNotation`;
  }

  findOne(id: number) {
    return `This action returns a #${id} parametreNotation`;
  }

  update(id: number, updateParametreNotationDto: UpdateParametreNotationDto) {
    return `This action updates a #${id} parametreNotation`;
  }

  remove(id: number) {
    return `This action removes a #${id} parametreNotation`;
  }
}
