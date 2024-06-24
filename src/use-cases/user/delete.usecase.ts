import { NotFoundError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class DeleteUserUseCase {
  async execute(id: string) {
    const userToDelete = await prismaRepository.user.fetchById(id);
    if (!userToDelete) throw new NotFoundError('User not found');

    return await prismaRepository.user.delete(userToDelete.id);
  }
}
