import type { Vault, VaultProps } from '../../entities/vault';

export interface VaultRepository {
  vaults?: Vault[];
  create({ name, userId }: VaultProps): Promise<Vault>;
  fetchUserVaults(userId: string): Promise<Vault[]>;
}
