import type { UserRepository } from './user/interface';
import { PrismaUserRepository } from './user/prisma';
import type { VaultRepository } from './vault/interface';
import { PrismaVaultRepository } from './vault/prisma';

class PrismaRepository {
  user: UserRepository = new PrismaUserRepository();
  vault: VaultRepository = new PrismaVaultRepository();
}

export const prismaRepository = new PrismaRepository();
