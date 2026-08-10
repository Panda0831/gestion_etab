import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from './prisma/prisma.module';
import { PkgUtilisateursModule } from './modules/pkg_utilisateurs/pkg-utilisateurs.module';
import { PkgStructureScolaireModule } from './modules/pkg_structure_scolaire/pkg-structure-scolaire.module';
import { PkgPedagogieModule } from './modules/pkg_pedagogie/pkg-pedagogie.module';
import { PkgCommunicationModule } from './modules/pkg_communication/pkg-communication.module';
import { PkgActivitesModule } from './modules/pkg_clubs_evenements/pkg-clubs-evenements.module';
import { PkgPaiementModule } from './modules/pkg_paiement/pkg-paiement.module';
import { PkgPersistenceModule } from './modules/pkg_persistence/pkg-persistence.module';
import { PkgIntegrationExterneModule } from './modules/pkg_integration_externe/pkg-integration-externe.module';
import { PkgAuthModule } from './modules/pkg_auth/pkg-auth.module';
import { JwtAuthGuard } from './modules/pkg_auth/guards/jwt-auth.guard';
import { RolesGuard } from './modules/pkg_auth/guards/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    PkgAuthModule,
    PkgUtilisateursModule,
    PkgStructureScolaireModule,
    PkgPedagogieModule,
    PkgCommunicationModule,
    PkgActivitesModule,
    PkgPaiementModule,
    PkgPersistenceModule,
    PkgIntegrationExterneModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
