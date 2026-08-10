// modules/pkg_integration_externe/pkg-integration-externe.module.ts
import { Module } from '@nestjs/common';

import { ApiMvolaController } from './api_mvola/api_mvola.controller';
import { ApiMvolaService } from './api_mvola/api_mvola.service';

import { ApiOrangeMoneyController } from './api_orange_money/api_orange_money.controller';
import { ApiOrangeMoneyService } from './api_orange_money/api_orange_money.service';

import { ServiceEmailController } from './service_email/service_email.controller';
import { ServiceEmailService } from './service_email/service_email.service';

import { ServiceMinIoS3Controller } from './service_min-io_s3/service_min-io_s3.controller';
import { ServiceMinIoS3Service } from './service_min-io_s3/service_min-io_s3.service';

@Module({
  controllers: [
    ApiMvolaController,
    ApiOrangeMoneyController,
    ServiceEmailController,
    ServiceMinIoS3Controller,
  ],
  providers: [
    ApiMvolaService,
    ApiOrangeMoneyService,
    ServiceEmailService,
    ServiceMinIoS3Service,
  ],
  exports: [
    ApiMvolaService,
    ApiOrangeMoneyService,
    ServiceEmailService,
    ServiceMinIoS3Service,
  ],
})
export class PkgIntegrationExterneModule {}
