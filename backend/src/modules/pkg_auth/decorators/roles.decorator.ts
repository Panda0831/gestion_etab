import { SetMetadata } from '@nestjs/common';
import { RoleUtilisateur } from '@prisma/client';
import { ROLES_KEY } from '../auth.constants';

export const Roles = (...roles: RoleUtilisateur[]) =>
  SetMetadata(ROLES_KEY, roles);
