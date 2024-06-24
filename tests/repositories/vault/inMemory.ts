import type { Vault } from '../../../src/entities/vault';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../../src/errors/Error';
import type { VaultRepository } from '../../../src/repositories/vault/interface';
import { localRepository } from '../inMemory';

export class InMemoryVaultRepository implements VaultRepository {
  vaults: Vault[] = [];

  async save(vault: Vault): Promise<Vault> {
    const parentUser = await localRepository.user.fetchById(vault.userId);
    if (!parentUser) throw new NotFoundError('Parent user not found');

    if (this.verifyNonConflictingName(vault.name, vault.userId))
      throw new ConflictError('This user already has a vault with this name');

    this.vaults.push(vault);
    return vault;
  }

  async listByUserId(userId: string): Promise<Vault[]> {
    const userToFetch = await localRepository.user.fetchById(userId);
    if (!userToFetch) throw new NotFoundError('User not found');

    const fetchedVaultList = this.vaults.filter(
      (vault: Vault) => vault.userId === userToFetch.id,
    );
    if (!fetchedVaultList.length)
      throw new NotFoundError('This user has no vaults');

    return fetchedVaultList;
  }

  async fetchById(id: string): Promise<Vault> {
    const fetchedVault = this.vaults.find((vault: Vault) => vault.id === id);
    if (!fetchedVault) throw new NotFoundError('Vault not found');

    return fetchedVault;
  }

  async update(id: string, name?: string, color?: string): Promise<Vault> {
    if (!name && !color)
      throw new BadRequestError('Missing fields in the request');

    const index = this.vaults.findIndex((vault: Vault) => vault.id === id);
    if (index === -1) throw new NotFoundError('Vault not found');

    const vaultToUpdate = this.vaults[index];

    if (name && this.verifyNonConflictingName(name, vaultToUpdate.userId))
      throw new ConflictError('Name is already in use');

    if (name !== undefined) vaultToUpdate.name = name;
    if (color !== undefined) vaultToUpdate.color = color;

    this.vaults[index] = vaultToUpdate;
    return vaultToUpdate;
  }

  async delete(vaultId: string): Promise<void> {
    const vaultToDelete = await this.fetchById(vaultId);
    if (!vaultToDelete) throw new NotFoundError('Vault not found');

    localRepository.credential.credentials =
      localRepository.credential.credentials!.filter(
        (credential) => credential.vaultId !== vaultId,
      );

    this.vaults = this.vaults.filter((vault) => vault.id !== vaultToDelete.id);
  }

  private verifyNonConflictingName(name: string, userId: string) {
    return this.vaults.some(
      (vault: Vault) => vault.name === name && vault.userId === userId,
    );
  }
}
