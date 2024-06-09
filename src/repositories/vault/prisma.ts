import { prisma } from '../../../prisma';
import type { Vault } from '../../entities/vault';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import type { VaultRepository } from './interface';

export class PrismaVaultRepository implements VaultRepository {
  async save(vault: Vault): Promise<Vault> {
    try {
      await this.verifyNonConflictingName(vault.name);
      return await prisma.vault.create({ data: vault });
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async listByUserId(userId: string): Promise<Vault[]> {
    try {
      const fetchedVaultList = await prisma.vault.findMany({
        where: { userId },
      });
      return fetchedVaultList;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async fetchById(id: string): Promise<Vault> {
    try {
      const fetchedVault = await prisma.vault.findUnique({ where: { id } });
      if (!fetchedVault) throw new NotFoundError('Vault not found');
      return fetchedVault;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  private async verifyNonConflictingName(name: string) {
    try {
      if (
        await prisma.vault.findFirst({
          where: { name: name },
        })
      )
        throw new ConflictError('This user already has a vault with this name');
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
