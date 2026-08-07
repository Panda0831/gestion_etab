import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DiscussionMembreService } from './discussion-membre.service';
import { CreateDiscussionMembreDto } from './dto/create-discussion-membre.dto';
import { UpdateDiscussionMembreDto } from './dto/update-discussion-membre.dto';

@Controller('discussion-membre')
export class DiscussionMembreController {
  constructor(private readonly discussionMembreService: DiscussionMembreService) {}

  @Post()
  create(@Body() createDiscussionMembreDto: CreateDiscussionMembreDto) {
    return this.discussionMembreService.create(createDiscussionMembreDto);
  }

  @Get()
  findAll() {
    return this.discussionMembreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discussionMembreService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDiscussionMembreDto: UpdateDiscussionMembreDto) {
    return this.discussionMembreService.update(+id, updateDiscussionMembreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discussionMembreService.remove(+id);
  }
}
