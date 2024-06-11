import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class DeleteUserUseCase {
  async execute(id: string) {
    try {
      return await prismaRepository.user.delete(id);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
