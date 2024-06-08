import type { Vault } from '../../entities/vault';

export interface VaultRepository {
  vaults?: Vault[];
  save(vault: Vault): Promise<Vault>;
}
