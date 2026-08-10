// src/prisma/prisma.module.ts
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // amzay izy tsy mila importena isakin'ny package
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
