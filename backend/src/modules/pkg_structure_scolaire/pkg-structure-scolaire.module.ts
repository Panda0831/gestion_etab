// modules/pkg_structure_scolaire/pkg-structure-scolaire.module.ts
import { Module } from '@nestjs/common';

import { EtablissementController } from './etablissement/etablissement.controller';
import { EtablissementService } from './etablissement/etablissement.service';

import { NiveauController } from './niveau/niveau.controller';
import { NiveauService } from './niveau/niveau.service';

import { ClasseController } from './classe/classe.controller';
import { ClasseService } from './classe/classe.service';

import { MatiereController } from './matiere/matiere.controller';
import { MatiereService } from './matiere/matiere.service';

import { ProfesseurMatiereController } from './professeur-matiere/professeur-matiere.controller';
import { ProfesseurMatiereService } from './professeur-matiere/professeur-matiere.service';

import { EmploiDuTempsController } from './emploi-du-temps/emploi-du-temps.controller';
import { EmploiDuTempsService } from './emploi-du-temps/emploi-du-temps.service';

@Module({
  controllers: [
    EtablissementController,
    NiveauController,
    ClasseController,
    MatiereController,
    ProfesseurMatiereController,
    EmploiDuTempsController,
  ],
  providers: [
    EtablissementService,
    NiveauService,
    ClasseService,
    MatiereService,
    ProfesseurMatiereService,
    EmploiDuTempsService,
  ],
  exports: [
    EtablissementService,
    NiveauService,
    ClasseService,
    MatiereService,
    ProfesseurMatiereService,
    EmploiDuTempsService,
  ],
})
export class PkgStructureScolaireModule {}
