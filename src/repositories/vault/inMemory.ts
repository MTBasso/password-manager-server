import { Vault, type VaultProps } from '../../entities/vault';
import { localRepository } from '../inMemoryInitializer';
import type { VaultRepository } from './interface';

export class InMemoryVaultRepository implements VaultRepository {
  vaults: Vault[] = [];

  async create({ name, userId }: VaultProps): Promise<Vault> {
    const user = await localRepository.userRepository.fetchById(userId);
    const createdVault = new Vault({ name, user });
    this.vaults.push(createdVault);
    return createdVault;
  }
}
