import { prisma } from '../../../prisma';
import type { Credential } from '../../entities/credential';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import { encryptPassword } from '../../utils/encryption';
import type { CredentialRepository } from './interface';

export class PrismaCredentialRepository implements CredentialRepository {
  async save(credential: Credential): Promise<Credential> {
    try {
      await this.verifyNonConflictingName(credential.name);
      return await prisma.credential.create({
        data: {
          id: credential.id,
          name: credential.name,
          login: credential.login,
          password: credential.password,
          vaultId: credential.vaultId,
        },
      });
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async fetchById(id: string): Promise<Credential> {
    try {
      const fetchedCredential = await prisma.credential.findUnique({
        where: { id },
      });
      if (!fetchedCredential) throw new NotFoundError('Credential not found');
      return fetchedCredential;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async listByVaultId(vaultId: string): Promise<Credential[]> {
    try {
      const fetchedCredentialList = await prisma.credential.findMany({
        where: { vaultId },
      });
      return fetchedCredentialList;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async update(id: string, data: Partial<Credential>): Promise<Credential> {
    if (!(await this.fetchById(id)))
      throw new NotFoundError('Credential not found');
    const parentVault = await prisma.vault.findUnique({
      where: { id: data.vaultId },
    });
    if (!parentVault)
      throw new NotFoundError('This Credential vault does not exist anymore');
    const parentUser = await prisma.user.findUnique({
      where: { id: parentVault.userId },
    });
    if (!parentUser)
      throw new NotFoundError('This Credential user does not exist anymore');
    if (data.name && (await this.verifyNonConflictingName(data.name)))
      throw new ConflictError(
        'This vault already has a credential with this name',
      );
    if (data.password)
      data.password = encryptPassword(data.password, parentUser.secret);
    return await prisma.credential.update({ where: { id }, data });
  }

  async delete(id: string): Promise<void> {
    if (!(await this.fetchById(id)))
      throw new NotFoundError('Credential not found');
    await prisma.credential.delete({ where: { id } });
  }

  private async verifyNonConflictingName(name: string) {
    if (
      await prisma.credential.findFirst({
        where: { name: name },
      })
    )
      return true;
  }
}
