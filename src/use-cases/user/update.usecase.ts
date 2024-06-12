import type { User } from '../../entities/user';
import { NotFoundError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class UpdateUserUseCase {
  async execute(id: string, data: Partial<User>) {
    const userToUpdate = await prismaRepository.user.fetchById(id);
    if (!userToUpdate) throw new NotFoundError('User was not found');
    return prismaRepository.user.update(userToUpdate.id, data);
  }
}
