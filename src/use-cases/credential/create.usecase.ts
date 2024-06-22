import { Credential } from '../../entities/credential';
import { NotFoundError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class CreateCredentialUseCase {
  async execute({ name, website, login, password, vaultId }: Credential) {
    const parentVault = await prismaRepository.vault.fetchById(vaultId);
    if (!parentVault) throw new NotFoundError('Parent vault not found');
    return await prismaRepository.credential.save(
      new Credential(name, website, login, password, vaultId),
    );
  }
}
