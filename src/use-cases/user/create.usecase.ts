import type { User } from '../../entities/user';
import { prismaRepository } from '../../repositories/prisma';

export class CreateUserUseCase {
  async execute(user: User): Promise<User> {
    return await prismaRepository.user.save(user);
  }
}
