import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class ListCredentialsUseCase {
  async execute(vaultId: string) {
    try {
      await prismaRepository.vault.fetchById(vaultId);
      return await prismaRepository.credential.listByVaultId(vaultId);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
