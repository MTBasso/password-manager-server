import { InMemoryUserRepository } from './user/inMemory';
import { InMemoryVaultRepository } from './vault/inMemory';

export class InMemoryRepository {
  userRepository = new InMemoryUserRepository();
  vaultRepository = new InMemoryVaultRepository();
}

export const localRepository = new InMemoryRepository();
