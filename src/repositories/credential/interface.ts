import type { Credential } from '../../entities/credential';

export interface CredentialRepository {
  credentials?: Credential[];
  save(credential: Credential): Promise<Credential>;
  fetchById(id: string): Promise<Credential>;
  readCredential(id: string): Promise<Credential>;
  listByVaultId(vaultId: string): Promise<Credential[]>;
  update(id: string, data: Partial<Credential>): Promise<Credential>;
  delete(id: string): Promise<void>;
  encryptPassword(plainPassword: string, secret: string): string;
  decryptPassword(encryptedPassword: string, secret: string): string;
}
