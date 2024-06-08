import type { Vault } from '../../entities/vault';
import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class CreateVaultUseCase {
  async execute(vault: Vault) {
    try {
      return await prismaRepository.vault.save(vault);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
