import { Injectable } from '@nestjs/common';
import { CreateServiceEmailDto } from './dto/create-service_email.dto';
import { UpdateServiceEmailDto } from './dto/update-service_email.dto';

@Injectable()
export class ServiceEmailService {
  create(createServiceEmailDto: CreateServiceEmailDto) {
    return 'This action adds a new serviceEmail';
  }

  findAll() {
    return `This action returns all serviceEmail`;
  }

  findOne(id: number) {
    return `This action returns a #${id} serviceEmail`;
  }

  update(id: number, updateServiceEmailDto: UpdateServiceEmailDto) {
    return `This action updates a #${id} serviceEmail`;
  }

  remove(id: number) {
    return `This action removes a #${id} serviceEmail`;
  }
}
