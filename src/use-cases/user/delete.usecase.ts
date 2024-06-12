import {
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class DeleteUserUseCase {
  async execute(id: string) {
    const userToDelete = await prismaRepository.user.fetchById(id);
    if (!userToDelete) throw new NotFoundError('User was not found');
    return await prismaRepository.user.delete(userToDelete.id);
  }
}
