import type { Credential } from '../../entities/credential';
import {
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class UpdateCredentialUseCase {
  async execute(id: string, data: Partial<Credential>) {
    const credentialToUpdate = await prismaRepository.credential.fetchById(id);
    if (!credentialToUpdate)
      throw new NotFoundError('Credential was not found');
    return prismaRepository.credential.update(credentialToUpdate.id, data);
  }
}
