import type { Vault } from '../../entities/vault';
import { NotFoundError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class CreateVaultUseCase {
  async execute(vault: Vault) {
    const parentUser = await prismaRepository.user.fetchById(vault.userId);
    if (!parentUser) throw new NotFoundError('Parent user not found');
    return await prismaRepository.vault.save(vault);
  }
}
