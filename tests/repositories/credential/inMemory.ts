import type { Credential } from '../../../src/entities/credential';
import {
  ConflictError,
  InternalServerError,
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
