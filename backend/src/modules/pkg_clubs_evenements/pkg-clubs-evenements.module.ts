import { Module } from '@nestjs/common';

import { ActiviteController } from './activite/activite.controller';
import { ActiviteService } from './activite/activite.service';

import { ClubEvenementController } from './club-evenement/club-evenement.controller';
import { ClubEvenementService } from './club-evenement/club-evenement.service';

import { ClubEvenementMembreController } from './club-evenement-membre/club-evenement-membre.controller';
import { ClubEvenementMembreService } from './club-evenement-membre/club-evenement-membre.service';

import { ClubEvenementOrganisateurController } from './club-evenement-organisateur/club-evenement-organisateur.controller';
import { ClubEvenementOrganisateurService } from './club-evenement-organisateur/club-evenement-organisateur.service';


@Module({
  controllers: [
    ActiviteController,
    ClubEvenementController,
    ClubEvenementMembreController,
    ClubEvenementOrganisateurController,
  ],
  providers: [
    ActiviteService,
    ClubEvenementService,
    ClubEvenementMembreService,
    ClubEvenementOrganisateurService,
  ],
  exports: [
    ActiviteService,
    ClubEvenementService,
    ClubEvenementMembreService,
    ClubEvenementOrganisateurService,
  ],
})
export class PkgActivitesModule {}