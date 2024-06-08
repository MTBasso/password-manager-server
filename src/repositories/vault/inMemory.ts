import type { Vault } from '../../entities/vault';
import type { VaultRepository } from './interface';

export class InMemoryVaultRepository implements VaultRepository {
  vaults: Vault[] = [];

  async create(vault: Vault): Promise<Vault> {
    this.vaults.push(vault);
    return vault;
  }

  async fetchUserVaults(userId: string): Promise<Vault[]> {
    return this.vaults.filter((vault) => vault.userId === userId);
  }
}
