import { prisma } from '../../../prisma';
import type { User } from '../../entities/user';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import type { UserRepository } from './interface';

export class PrismaUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    try {
      await this.verifyValidUsername(user.username);
      await this.verifyValidEmail(user.email);
      return await prisma.user.create({ data: user });
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async fetchById(id: string): Promise<User> {
    try {
      const fetchedUser = await prisma.user.findUnique({
        where: { id },
      });
      if (!fetchedUser) throw new NotFoundError('User not found');
      return fetchedUser;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async delete(id: string) {
    await prisma.user.delete({ where: { id } });
  }

  private async verifyValidUsername(username: string) {
    try {
      if (
        await prisma.user.findUnique({
          where: { username },
        })
      )
        throw new ConflictError('Username already in use');
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  private async verifyValidEmail(email: string) {
    try {
      if (
        await prisma.user.findUnique({
          where: { email },
        })
      )
        throw new ConflictError('Email already in use');
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
