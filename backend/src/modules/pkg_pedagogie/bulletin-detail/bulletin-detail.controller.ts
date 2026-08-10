import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { BulletinDetailService } from './bulletin-detail.service';
import { CreateBulletinDetailDto } from './dto/create-bulletin-detail.dto';
import { UpdateBulletinDetailDto } from './dto/update-bulletin-detail.dto';

@Controller('bulletin-detail')
export class BulletinDetailController {
  constructor(private readonly bulletinDetailService: BulletinDetailService) {}

  @Post()
  create(@Body() createBulletinDetailDto: CreateBulletinDetailDto) {
    return this.bulletinDetailService.create(createBulletinDetailDto);
  }

  @Get()
  findAll() {
    return this.bulletinDetailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bulletinDetailService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateBulletinDetailDto: UpdateBulletinDetailDto,
  ) {
    return this.bulletinDetailService.update(id, updateBulletinDetailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bulletinDetailService.remove(id);
  }
}
