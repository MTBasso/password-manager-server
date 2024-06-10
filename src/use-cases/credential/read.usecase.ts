import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';
import { decryptPassword } from '../../utils/encryption';

export class ReadCredentialUseCase {
  async execute(id: string) {
    try {
      const fetchedCredential = await prismaRepository.credential.fetchById(id);
      const fetchedVault = await prismaRepository.vault.fetchById(
        fetchedCredential.vaultId,
      );
      const fetchedUser = await prismaRepository.user.fetchById(
        fetchedVault.userId,
      );
      return {
        ...fetchedCredential,
        password: decryptPassword(
          fetchedCredential.password,
          fetchedUser.secret,
        ),
      };
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
