import { Injectable } from '@nestjs/common';
import { CreateApiOrangeMoneyDto } from './dto/create-api_orange_money.dto';
import { UpdateApiOrangeMoneyDto } from './dto/update-api_orange_money.dto';

@Injectable()
export class ApiOrangeMoneyService {
  create(createApiOrangeMoneyDto: CreateApiOrangeMoneyDto) {
    return 'This action adds a new apiOrangeMoney';
  }

  findAll() {
    return `This action returns all apiOrangeMoney`;
  }

  findOne(id: number) {
    return `This action returns a #${id} apiOrangeMoney`;
  }

  update(id: number, updateApiOrangeMoneyDto: UpdateApiOrangeMoneyDto) {
    return `This action updates a #${id} apiOrangeMoney`;
  }

  remove(id: number) {
    return `This action removes a #${id} apiOrangeMoney`;
  }
}
