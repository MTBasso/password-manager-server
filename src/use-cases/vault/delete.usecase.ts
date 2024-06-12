import { NotFoundError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class DeleteVaultUseCase {
  async execute(id: string) {
    const vaultToDelete = await prismaRepository.vault.fetchById(id);
    if (!vaultToDelete) throw new NotFoundError('Vault was not found');
    return await prismaRepository.vault.delete(vaultToDelete.id);
  }
}
