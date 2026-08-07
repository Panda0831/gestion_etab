import { Injectable } from '@nestjs/common';
import { CreateApiMvolaDto } from './dto/create-api_mvola.dto';
import { UpdateApiMvolaDto } from './dto/update-api_mvola.dto';

@Injectable()
export class ApiMvolaService {
  create(createApiMvolaDto: CreateApiMvolaDto) {
    return 'This action adds a new apiMvola';
  }

  findAll() {
    return `This action returns all apiMvola`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apiMvola`;
  }

  update(id: number, updateApiMvolaDto: UpdateApiMvolaDto) {
    return `This action updates a #${id} apiMvola`;
  }

  remove(id: number) {
    return `This action removes a #${id} apiMvola`;
  }
}
