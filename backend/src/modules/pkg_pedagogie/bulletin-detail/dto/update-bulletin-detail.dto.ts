import { PartialType } from '@nestjs/mapped-types';
import { CreateBulletinDetailDto } from './create-bulletin-detail.dto';

export class UpdateBulletinDetailDto extends PartialType(
  CreateBulletinDetailDto,
) {}
