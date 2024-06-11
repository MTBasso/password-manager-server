import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class ListVaultsUseCase {
  async execute(userId: string) {
    try {
      await prismaRepository.user.fetchById(userId);
      return await prismaRepository.vault.listByUserId(userId);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
