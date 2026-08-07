import { Injectable } from '@nestjs/common';
import { CreatePointageDto } from './dto/create-pointage.dto';
import { UpdatePointageDto } from './dto/update-pointage.dto';

@Injectable()
export class PointageService {
  create(createPointageDto: CreatePointageDto) {
    return 'This action adds a new pointage';
  }

  findAll() {
    return `This action returns all pointage`;
  }

  findOne(id: number) {
    return `This action returns a #${id} pointage`;
  }

  update(id: number, updatePointageDto: UpdatePointageDto) {
    return `This action updates a #${id} pointage`;
  }

  remove(id: number) {
    return `This action removes a #${id} pointage`;
  }
}
