import { NotFoundError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class UpdateVaultUseCase {
  async execute(id: string, name: string) {
    const vaultToUpdate = await prismaRepository.vault.fetchById(id);
    if (!vaultToUpdate) throw new NotFoundError('Vault was not found');
    return prismaRepository.vault.update(vaultToUpdate.id, name);
  }
}
