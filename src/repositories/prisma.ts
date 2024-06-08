import { PrismaUserRepository } from './user/prisma';

export class PrismaRepository {
  userRepository = new PrismaUserRepository();
  // vaultRepository = new InMemoryVaultRepository();
}
