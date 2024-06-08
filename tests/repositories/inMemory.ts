import type { UserRepository } from '../../src/repositories/user/interface';
import type { VaultRepository } from '../../src/repositories/vault/interface';
import { InMemoryUserRepository } from './user/inMemory';
import { InMemoryVaultRepository } from './vault/inMemory';

class InMemoryRepository {
  user: UserRepository = new InMemoryUserRepository();
  vault: VaultRepository = new InMemoryVaultRepository();
}

export const localRepository = new InMemoryRepository();
