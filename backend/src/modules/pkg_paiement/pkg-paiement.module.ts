// modules/pkg_paiement/pkg-paiement.module.ts
import { Module } from '@nestjs/common';

import { TransactionFinanciereController } from './transaction-financiere/transaction-financiere.controller';
import { TransactionFinanciereService } from './transaction-financiere/transaction-financiere.service';

@Module({
  controllers: [TransactionFinanciereController],
  providers: [TransactionFinanciereService],
  exports: [TransactionFinanciereService],
})
export class PkgPaiementModule {}