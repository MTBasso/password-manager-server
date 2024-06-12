import {
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class ListVaultsUseCase {
  async execute(userId: string) {
    const parentUser = await prismaRepository.user.fetchById(userId);
    if (!parentUser) throw new NotFoundError('Parent user was not found');
    return await prismaRepository.vault.listByUserId(parentUser.id);
  }
}
