// modules/pkg_pedagogie/pkg-pedagogie.module.ts
import { Module } from '@nestjs/common';

import { CoursController } from './cours/cours.controller';
import { CoursService } from './cours/cours.service';

import { CoursMediaController } from './cours-media/cours-media.controller';
import { CoursMediaService } from './cours-media/cours-media.service';

import { EvaluationController } from './evaluation/evaluation.controller';
import { EvaluationService } from './evaluation/evaluation.service';

import { NoteController } from './note/note.controller';
import { NoteService } from './note/note.service';

import { BulletinController } from './bulletin/bulletin.controller';
import { BulletinService } from './bulletin/bulletin.service';

import { BulletinDetailController } from './bulletin-detail/bulletin-detail.controller';
import { BulletinDetailService } from './bulletin-detail/bulletin-detail.service';

import { ParametreNotationController } from './parametre-notation/parametre-notation.controller';
import { ParametreNotationService } from './parametre-notation/parametre-notation.service';

@Module({
  controllers: [
    CoursController,
    CoursMediaController,
    EvaluationController,
    NoteController,
    BulletinController,
    BulletinDetailController,
    ParametreNotationController,
  ],
  providers: [
    CoursService,
    CoursMediaService,
    EvaluationService,
    NoteService,
    BulletinService,
    BulletinDetailService,
    ParametreNotationService,
  ],
  exports: [
    CoursService,
    CoursMediaService,
    EvaluationService,
    NoteService,
    BulletinService,
    BulletinDetailService,
    ParametreNotationService,
  ],
})
export class PkgPedagogieModule {}
