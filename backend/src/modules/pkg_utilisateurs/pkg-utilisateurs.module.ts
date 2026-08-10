// modules/pkg_utilisateurs/pkg-utilisateurs.module.ts
import { Module } from '@nestjs/common';

import { UtilisateurController } from './utilisateur/utilisateur.controller';
import { UtilisateurService } from './utilisateur/utilisateur.service';

import { ParentController } from './parent/parent.controller';
import { ParentService } from './parent/parent.service';

import { EleveController } from './eleve/eleve.controller';
import { EleveService } from './eleve/eleve.service';

import { PointageController } from './pointage/pointage.controller';
import { PointageService } from './pointage/pointage.service';

@Module({
  controllers: [
    UtilisateurController,
    ParentController,
    EleveController,
    PointageController,
  ],
  providers: [UtilisateurService, ParentService, EleveService, PointageService],
  exports: [UtilisateurService, ParentService, EleveService, PointageService],
})
export class PkgUtilisateursModule {}
