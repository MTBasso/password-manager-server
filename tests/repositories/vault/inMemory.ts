import type { Vault } from '../../../src/entities/vault';
import {
  ConflictError,
  InternalServerError,
  isCustomError,
} from '../../../src/errors/Error';
import type { VaultRepository } from '../../../src/repositories/vault/interface';
import { localRepository } from '../inMemory';

export class InMemoryVaultRepository implements VaultRepository {
  vaults: Vault[] = [];

  async save(vault: Vault): Promise<Vault> {
    try {
      this.verifyNonConflictingName(vault.name);
      await localRepository.user.fetchById(vault.userId);
      this.vaults.push(vault);
      return vault;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  private verifyNonConflictingName(name: string) {
    if (this.vaults.some((vault: Vault) => vault.name === name))
      throw new ConflictError('This user already has a vault with this name');
  }
}
