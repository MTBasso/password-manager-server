import type { User } from '../../entities/user';
import { InternalServerError, isCustomError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class UpdateUserUseCase {
  async execute(id: string, data: Partial<User>) {
    try {
      return prismaRepository.user.update(id, data);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
