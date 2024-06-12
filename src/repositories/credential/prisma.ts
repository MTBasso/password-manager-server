import { AES, enc } from 'crypto-js';
import { prisma } from '../../../prisma';
import type { Credential } from '../../entities/credential';
import { ConflictError, NotFoundError } from '../../errors/Error';
import type { CredentialRepository } from './interface';

export class PrismaCredentialRepository implements CredentialRepository {
  async save(credential: Credential): Promise<Credential> {
    if (
      await this.verifyNonConflictingName(credential.name, credential.vaultId)
    )
      throw new ConflictError(
        'This vault already has a credential with this name',
      );
    const parentVault = await prisma.vault.findUnique({
      where: { id: credential.vaultId },
    });
    if (!parentVault) throw new NotFoundError('Parent vault not found');
    const parentUser = await prisma.user.findUnique({
      where: { id: parentVault.userId },
    });
    if (!parentUser) throw new NotFoundError('Parent user not found');
    credential.password = this.encryptPassword(
      credential.password,
      parentUser.secret,
    );
    return await prisma.credential.create({
      data: {
        id: credential.id,
        name: credential.name,
        login: credential.login,
        password: credential.password,
        vaultId: credential.vaultId,
      },
    });
  }

  async readCredential(id: string): Promise<Credential> {
    const fetchedCredential = await prisma.credential.findUnique({
      where: { id },
    });
    if (!fetchedCredential) throw new NotFoundError('Credential not found');
    const parentVault = await prisma.vault.findUnique({
      where: { id: fetchedCredential.vaultId },
    });
    if (!parentVault) throw new NotFoundError('Parent vault not found');
    const parentUser = await prisma.user.findUnique({
      where: { id: parentVault.userId },
    });
    if (!parentUser) throw new NotFoundError('Parent user not found');
    return {
      ...fetchedCredential,
      password: this.decryptPassword(
        fetchedCredential.password,
        parentUser.secret,
      ),
    };
  }

  async fetchById(id: string): Promise<Credential> {
    const fetchedCredential = await prisma.credential.findUnique({
      where: { id },
    });
    if (!fetchedCredential) throw new NotFoundError('Credential not found');
    return fetchedCredential;
  }

  async listByVaultId(vaultId: string): Promise<Credential[]> {
    const fetchedCredentialList = await prisma.credential.findMany({
      where: { vaultId },
    });
    if (!fetchedCredentialList)
      throw new NotFoundError('This vault has no credentials');
    return fetchedCredentialList;
  }

  async update(id: string, data: Partial<Credential>): Promise<Credential> {
    const credentialToUpdate = await this.fetchById(id);
    if (!credentialToUpdate) throw new NotFoundError('Credential not found');
    const parentVault = await prisma.vault.findUnique({
      where: { id: credentialToUpdate.vaultId },
    });
    if (!parentVault)
      throw new NotFoundError('This Credential vault does not exist anymore');
    const parentUser = await prisma.user.findUnique({
      where: { id: parentVault.userId },
    });
    if (!parentUser)
      throw new NotFoundError('This Credential user does not exist anymore');
    if (
      data.name &&
      (await this.verifyNonConflictingName(data.name, parentVault.id))
    )
      throw new ConflictError(
        'This vault already has a credential with this name',
      );
    if (data.password)
      data.password = this.encryptPassword(data.password, parentUser.secret);
    return await prisma.credential.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    if (!(await this.fetchById(id)))
      throw new NotFoundError('Credential not found');
    await prisma.credential.delete({ where: { id } });
  }

  private encryptPassword(plainPassword: string, secret: string): string {
    return AES.encrypt(plainPassword, secret).toString();
  }

  private decryptPassword(encryptedPassword: string, secret: string): string {
    const bytes = AES.decrypt(encryptedPassword, secret);
    return bytes.toString(enc.Utf8);
  }

  private async verifyNonConflictingName(name: string, vaultId: string) {
    if (
      await prisma.credential.findFirst({
        where: { name, vaultId },
      })
    )
      return true;
  }
}
