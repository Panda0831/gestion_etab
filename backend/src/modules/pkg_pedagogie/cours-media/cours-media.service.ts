import { Injectable } from '@nestjs/common';
import { CreateCoursMediaDto } from './dto/create-cours-media.dto';
import { UpdateCoursMediaDto } from './dto/update-cours-media.dto';

@Injectable()
export class CoursMediaService {
  create(createCoursMediaDto: CreateCoursMediaDto) {
    return 'This action adds a new coursMedia';
  }

  findAll() {
    return `This action returns all coursMedia`;
  }

  findOne(id: number) {
    return `This action returns a #${id} coursMedia`;
  }

  update(id: number, updateCoursMediaDto: UpdateCoursMediaDto) {
    return `This action updates a #${id} coursMedia`;
  }

  remove(id: number) {
    return `This action removes a #${id} coursMedia`;
  }
}
