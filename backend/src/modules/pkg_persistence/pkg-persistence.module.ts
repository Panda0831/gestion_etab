// modules/pkg_persistence/pkg-persistence.module.ts
import { Module } from '@nestjs/common';

import { AuditLogController } from './audit-log/audit-log.controller';
import { AuditLogService } from './audit-log/audit-log.service';

@Module({
  controllers: [AuditLogController],
  providers: [AuditLogService],
  exports: [AuditLogService],
})
export class PkgPersistenceModule {}