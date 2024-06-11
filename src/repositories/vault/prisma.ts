import { prisma } from '../../../prisma';
import type { Vault } from '../../entities/vault';
import { ConflictError, NotFoundError } from '../../errors/Error';
import { PrismaUserRepository } from '../user/prisma';
import type { VaultRepository } from './interface';

export class PrismaVaultRepository implements VaultRepository {
  async save(vault: Vault): Promise<Vault> {
    if (!(await prisma.user.findUnique({ where: { id: vault.userId } })))
      throw new NotFoundError('User not found');
    if (await this.verifyNonConflictingName(vault.name))
      throw new ConflictError('Username is already in use');
    return await prisma.vault.create({
      data: {
        id: vault.id,
        name: vault.name,
        userId: vault.userId,
      },
    });
  }

  async listByUserId(userId: string): Promise<Vault[]> {
    const userToFetch = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!userToFetch) throw new NotFoundError('User not found');
    const fetchedVaultList = await prisma.vault.findMany({
      where: { userId: userToFetch.id },
    });
    if (!fetchedVaultList) throw new NotFoundError('This user has no vaults');
    return fetchedVaultList;
  }

  async fetchById(id: string): Promise<Vault> {
    const fetchedVault = await prisma.vault.findUnique({ where: { id } });
    if (!fetchedVault) throw new NotFoundError('Vault not found');
    return fetchedVault;
  }

  async update(id: string, name: string): Promise<Vault> {
    if (!(await this.fetchById(id))) throw new NotFoundError('Vault not found');
    if (name && (await this.verifyNonConflictingName(name)))
      throw new ConflictError('Name is already in use');
    return await prisma.vault.update({
      where: { id },
      data: { name },
    });
  }

  async delete(vaultId: string): Promise<void> {
    if (!(await this.fetchById(vaultId)))
      throw new NotFoundError('Vault not found');
    await prisma.credential.deleteMany({ where: { vaultId } });
    await prisma.vault.delete({ where: { id: vaultId } });
  }

  private async verifyNonConflictingName(name: string) {
    if (
      await prisma.vault.findFirst({
        where: { name: name },
      })
    )
      return true;
  }
}
