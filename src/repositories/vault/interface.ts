import type { Vault } from '../../entities/vault';

export interface VaultRepository {
  vaults?: Vault[];
  create({ name, userId }): Promise<Vault>;
}
