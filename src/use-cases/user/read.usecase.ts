import { NotFoundError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class ReadUserUseCase {
  async execute(id: string) {
    const userToRead = await prismaRepository.user.fetchById(id);
    if (!userToRead) throw new NotFoundError('User not found');
    return userToRead;
  }
}
