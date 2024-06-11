import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class DeleteCredentialUseCase {
  async execute(id: string) {
    try {
      return await prismaRepository.credential.delete(id);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
