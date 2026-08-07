import { Injectable } from '@nestjs/common';
import { CreateDiscussionMembreDto } from './dto/create-discussion-membre.dto';
import { UpdateDiscussionMembreDto } from './dto/update-discussion-membre.dto';

@Injectable()
export class DiscussionMembreService {
  create(createDiscussionMembreDto: CreateDiscussionMembreDto) {
    return 'This action adds a new discussionMembre';
  }

  findAll() {
    return `This action returns all discussionMembre`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discussionMembre`;
  }

  update(id: number, updateDiscussionMembreDto: UpdateDiscussionMembreDto) {
    return `This action updates a #${id} discussionMembre`;
  }

  remove(id: number) {
    return `This action removes a #${id} discussionMembre`;
  }
}
