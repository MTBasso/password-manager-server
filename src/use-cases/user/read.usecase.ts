import {
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class ReadUserUseCase {
  async execute(id: string) {
    const userToRead = await prismaRepository.user.fetchById(id);
    if (!userToRead) throw new NotFoundError('User was not found');
    return userToRead;
  }
}
