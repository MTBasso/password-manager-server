import { AES, enc } from 'crypto-js';
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
    if (this.verifyNonConflictingName(credential.name, credential.vaultId))
      throw new ConflictError(
        'This vault already has a credential with this name',
      );
    const parentVault = await localRepository.vault.fetchById(
      credential.vaultId,
    );
    if (!parentVault) throw new NotFoundError('Parent vault not found');
    const parentUser = await localRepository.user.fetchById(parentVault.userId);
    if (!parentUser) throw new NotFoundError('Parent user not found');
    const savedCredential: Credential = {
      ...credential,
      password: this.encryptPassword(credential.password, parentUser.secret),
    };
    this.credentials.push(savedCredential);
    return savedCredential;
  }

  async fetchById(id: string): Promise<Credential> {
    const fetchedCredential = this.credentials.find(
      (credential: Credential) => credential.id === id,
    );
    if (!fetchedCredential) throw new NotFoundError('Credential not found');
    return fetchedCredential;
  }

  async readCredential(id: string): Promise<Credential> {
    const credential = await this.fetchById(id);
    if (!credential) throw new NotFoundError('Credential not found');
    const parentVault = await localRepository.vault.fetchById(
      credential.vaultId,
    );
    if (!parentVault) throw new NotFoundError('Parent vault not found');
    const parentUser = await localRepository.user.fetchById(parentVault.userId);
    if (!parentUser) throw new NotFoundError('Parent user not found');
    const updatedCredential: Credential = {
      ...credential,
      password: this.decryptPassword(credential.password, parentUser.secret),
    };
    this.credentials.push(updatedCredential);
    return updatedCredential;
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

  async update(id: string, data: Partial<Credential>): Promise<Credential> {
    const index = this.credentials.findIndex(
      (credential: Credential) => credential.id === id,
    );
    if (index === -1) throw new NotFoundError('Credential not found');

    const credentialToUpdate = this.credentials[index];

    const parentVault = await localRepository.vault.fetchById(
      credentialToUpdate.vaultId,
    );
    if (!parentVault)
      throw new NotFoundError('This Credential vault does not exist anymore');

    const parentUser = await localRepository.user.fetchById(parentVault.userId);
    if (!parentUser)
      throw new NotFoundError('This Credential user does not exist anymore');

    if (data.name && this.verifyNonConflictingName(data.name, parentVault.id))
      throw new ConflictError(
        'This vault already has a credential with this name',
      );

    if (data.name !== undefined) credentialToUpdate.name = data.name;
    if (data.login !== undefined) credentialToUpdate.login = data.login;
    if (data.password !== undefined)
      credentialToUpdate.password = this.encryptPassword(
        data.password,
        parentUser.secret,
      );

    this.credentials[index] = credentialToUpdate;
    return credentialToUpdate;
  }

  async delete(id: string): Promise<void> {
    const credentialToDelete = await localRepository.credential.fetchById(id);
    if (!credentialToDelete) throw new NotFoundError('Credential not found');
    this.credentials = this.credentials.filter(
      (credential) => credential.id !== credentialToDelete.id,
    );
  }

  encryptPassword(plainPassword: string, secret: string): string {
    return AES.encrypt(plainPassword, secret).toString();
  }

  decryptPassword(encryptedPassword: string, secret: string): string {
    const bytes = AES.decrypt(encryptedPassword, secret);
    return bytes.toString(enc.Utf8);
  }

  private verifyNonConflictingName(name: string, vaultId: string) {
    if (
      this.credentials.some(
        (credential: Credential) =>
          credential.name === name && credential.vaultId === vaultId,
      )
    )
      return true;
  }
}
