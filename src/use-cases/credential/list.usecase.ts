import {
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class ListCredentialsUseCase {
  async execute(vaultId: string) {
    const vaultToFetch = await prismaRepository.vault.fetchById(vaultId);
    if (!vaultToFetch) throw new NotFoundError('Vault was not found');
    return await prismaRepository.credential.listByVaultId(vaultToFetch.id);
  }
}
