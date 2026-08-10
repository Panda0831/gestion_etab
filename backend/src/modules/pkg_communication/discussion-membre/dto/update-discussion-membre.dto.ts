import { PartialType } from '@nestjs/mapped-types';
import { CreateDiscussionMembreDto } from './create-discussion-membre.dto';

export class UpdateDiscussionMembreDto extends PartialType(
  CreateDiscussionMembreDto,
) {}
