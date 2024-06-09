import type { Credential } from '../../entities/credential';

export interface CredentialRepository {
  credentials?: Credential[];
  save(credential: Credential): Promise<Credential>;
  fetchById(id: string): Promise<Credential>;
}
