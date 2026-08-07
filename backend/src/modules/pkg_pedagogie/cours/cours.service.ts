import { Injectable } from '@nestjs/common';
import { CreateCourDto } from './dto/create-cour.dto';
import { UpdateCourDto } from './dto/update-cour.dto';

@Injectable()
export class CoursService {
  create(createCourDto: CreateCourDto) {
    return 'This action adds a new cour';
  }

  findAll() {
    return `This action returns all cours`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cour`;
  }

  update(id: number, updateCourDto: UpdateCourDto) {
    return `This action updates a #${id} cour`;
  }

  remove(id: number) {
    return `This action removes a #${id} cour`;
  }
}
