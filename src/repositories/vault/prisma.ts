import { prisma } from '../../../prisma';
import type { Vault, VaultProps } from '../../entities/vault';
import { InternalServerError, isCustomError } from '../../errors/Error';
import type { VaultRepository } from './interface';

export class PrismaVaultRepository implements VaultRepository {
  async create(vault: Vault): Promise<Vault> {
    try {
      vault.user = undefined;
      return await prisma.vault.create({ data: vault });
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async fetchUserVaults(userId: string): Promise<Vault[]> {
    try {
      return await prisma.vault.findMany({
        where: { userId },
      });
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
