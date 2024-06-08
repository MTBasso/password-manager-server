import { PrismaUserRepository } from './user/prisma';
import { PrismaVaultRepository } from './vault/prisma';

export class PrismaRepository {
  userRepository = new PrismaUserRepository();
  vaultRepository = new PrismaVaultRepository();
}

export const prismaRepository = new PrismaRepository();
