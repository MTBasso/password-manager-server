import type { Credential } from '../../../src/entities/credential';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../../src/errors/Error';
import type { CredentialRepository } from '../../../src/repositories/credential/interface';
import { localRepository } from '../inMemory';

export class InMemoryCredentialRepository implements CredentialRepository {
  credentials: Credential[] = [];

  async save(credential: Credential): Promise<Credential> {
    try {
      this.verifyNonConflictingName(credential.name, credential.vaultId);
      await localRepository.vault.fetchById(credential.vaultId);
      this.credentials.push(credential);
      return credential;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async fetchById(id: string): Promise<Credential> {
    const fetchedCredential = this.credentials.find(
      (credential: Credential) => credential.id === id,
    );
    if (!fetchedCredential) throw new NotFoundError('Credential not found');
    return fetchedCredential;
  }

  async listByVaultId(vaultId: string): Promise<Credential[]> {
    try {
      await localRepository.vault.fetchById(vaultId);
      return this.credentials.filter(
        (credential: Credential) => credential.vaultId === vaultId,
      );
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  private verifyNonConflictingName(name: string, vaultId: string) {
    if (
      this.credentials.some(
        (credential: Credential) =>
          credential.name === name && credential.vaultId === vaultId,
      )
    ) {
      throw new ConflictError(
        'This vault already has a credential with this name',
      );
    }
  }
}
