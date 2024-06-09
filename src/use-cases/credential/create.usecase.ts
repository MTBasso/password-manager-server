import { Credential } from '../../entities/credential';
import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class CreateCredentialUseCase {
  async execute({ name, login, password, vaultId }: Credential) {
    try {
      const fetchedVault = await prismaRepository.vault.fetchById(vaultId);
      const fetchedUser = await prismaRepository.user.fetchById(
        fetchedVault.userId,
      );
      return await prismaRepository.credential.save(
        new Credential(name, login, password, vaultId, fetchedUser.secret),
      );
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
