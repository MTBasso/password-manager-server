import type { Vault } from '../../../src/entities/vault';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../../src/errors/Error';
import type { VaultRepository } from '../../../src/repositories/vault/interface';
import { localRepository } from '../inMemory';

export class InMemoryVaultRepository implements VaultRepository {
  vaults: Vault[] = [];

  async save(vault: Vault): Promise<Vault> {
    if (this.verifyNonConflictingName(vault.name, vault.userId))
      throw new ConflictError('This user already has a vault with this name');
    const parentUser = await localRepository.user.fetchById(vault.userId);
    if (!parentUser) throw new NotFoundError('Parent user not found');
    this.vaults.push(vault);
    return vault;
  }

  async fetchById(id: string): Promise<Vault> {
    const fetchedVault = this.vaults.find((vault: Vault) => vault.id === id);
    if (!fetchedVault) throw new NotFoundError('Vault not found');
    return fetchedVault;
  }

  async listByUserId(userId: string): Promise<Vault[]> {
    const userToFetch = await localRepository.user.fetchById(userId);
    if (!userToFetch) throw new NotFoundError('User not found');
    return this.vaults.filter(
      (vault: Vault) => vault.userId === userToFetch.id,
    );
  }

  async update(id: string, name: string): Promise<Vault> {
    const index = this.vaults.findIndex((vault: Vault) => vault.id === id);
    if (index === -1) throw new NotFoundError('Vault not found');

    const vaultToUpdate = this.vaults[index];

    const parentUser = await localRepository.user.fetchById(
      vaultToUpdate.userId,
    );
    if (!parentUser) throw new NotFoundError('Parent user not found');

    if (name && this.verifyNonConflictingName(name, parentUser.id))
      throw new ConflictError('This user already has a vault with this name');

    if (name !== undefined) vaultToUpdate.name = name;

    this.vaults[index] = vaultToUpdate;
    return vaultToUpdate;
  }

  async delete(id: string): Promise<void> {
    const vaultToDelete = await localRepository.vault.fetchById(id);
    if (!vaultToDelete) throw new NotFoundError('Vault not found');
    this.vaults = this.vaults.filter((vault) => vault.id !== vaultToDelete.id);
  }

  private verifyNonConflictingName(name: string, userId: string) {
    if (
      this.vaults.some(
        (vault: Vault) => vault.name === name && vault.userId === userId,
      )
    )
      return true;
    return false;
  }
}
