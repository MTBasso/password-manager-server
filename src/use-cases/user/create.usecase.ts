import type { User } from '../../entities/user';
import { InternalServerError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class CreateUserUseCase {
  async execute(user: User): Promise<User> {
    const createdUser = await prismaRepository.user.save(user);
    if (!createdUser)
      throw new InternalServerError('Repository failed to create user');
    return createdUser;
  }
}
