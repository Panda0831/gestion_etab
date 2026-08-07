import { Injectable } from '@nestjs/common';
import { CreateFournitureDto } from './dto/create-fourniture.dto';
import { UpdateFournitureDto } from './dto/update-fourniture.dto';

@Injectable()
export class FournitureService {
  create(createFournitureDto: CreateFournitureDto) {
    return 'This action adds a new fourniture';
  }

  findAll() {
    return `This action returns all fourniture`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fourniture`;
  }

  update(id: number, updateFournitureDto: UpdateFournitureDto) {
    return `This action updates a #${id} fourniture`;
  }

  remove(id: number) {
    return `This action removes a #${id} fourniture`;
  }
}
