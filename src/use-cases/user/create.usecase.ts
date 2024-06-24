import type { User } from '../../entities/user';
import { InternalServerError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';
import type { SaveUserResponseType } from '../../repositories/user/prisma';

export class CreateUserUseCase {
  async execute(user: User): Promise<SaveUserResponseType> {
    const createdUser = await prismaRepository.user.save(user);
    if (!createdUser)
      throw new InternalServerError('Repository failed to create user');

    return createdUser;
  }
}
