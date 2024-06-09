import type { CredentialRepository } from '../../src/repositories/credential/interface';
import type { UserRepository } from '../../src/repositories/user/interface';
import type { VaultRepository } from '../../src/repositories/vault/interface';
import { InMemoryCredentialRepository } from './credential/inMemory';
import { InMemoryUserRepository } from './user/inMemory';
import { InMemoryVaultRepository } from './vault/inMemory';

class InMemoryRepository {
  user: UserRepository = new InMemoryUserRepository();
  vault: VaultRepository = new InMemoryVaultRepository();
  credential: CredentialRepository = new InMemoryCredentialRepository();
}

export const localRepository = new InMemoryRepository();
