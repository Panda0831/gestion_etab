import { Injectable } from '@nestjs/common';
import { CreateBulletinDetailDto } from './dto/create-bulletin-detail.dto';
import { UpdateBulletinDetailDto } from './dto/update-bulletin-detail.dto';

@Injectable()
export class BulletinDetailService {
  create(createBulletinDetailDto: CreateBulletinDetailDto) {
    return 'This action adds a new bulletinDetail';
  }

  findAll() {
    return `This action returns all bulletinDetail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} bulletinDetail`;
  }

  update(id: number, updateBulletinDetailDto: UpdateBulletinDetailDto) {
    return `This action updates a #${id} bulletinDetail`;
  }

  remove(id: number) {
    return `This action removes a #${id} bulletinDetail`;
  }
}
