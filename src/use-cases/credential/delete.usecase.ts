import { NotFoundError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class DeleteCredentialUseCase {
  async execute(id: string) {
    const credentialToDelete = await prismaRepository.credential.fetchById(id);
    if (!credentialToDelete) throw new NotFoundError('Credential was not fond');
    return await prismaRepository.credential.delete(id);
  }
}
