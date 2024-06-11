import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class DeleteVaultUseCase {
  async execute(id: string) {
    try {
      return await prismaRepository.vault.delete(id);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
