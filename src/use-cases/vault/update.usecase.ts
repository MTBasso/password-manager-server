import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class UpdateVaultUseCase {
  async execute(id: string, name: string) {
    try {
      return prismaRepository.vault.update(id, name);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
