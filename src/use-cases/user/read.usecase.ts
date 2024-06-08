import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class ReadUserUseCase {
  async execute(id: string) {
    try {
      return await prismaRepository.user.fetchById(id);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
