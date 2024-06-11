import type { Credential } from '../../entities/credential';
import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class UpdateCredentialUseCase {
  async execute(id: string, data: Partial<Credential>) {
    try {
      return prismaRepository.credential.update(id, data);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
