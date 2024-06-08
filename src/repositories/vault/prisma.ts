import { prisma } from '../../../prisma';
import type { Vault } from '../../entities/vault';
import {
  ConflictError,
  InternalServerError,
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
