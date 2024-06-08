import { prisma } from '../../../prisma';
import { User, type UserProps } from '../../entities/user';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import type { UserRepository } from './interface';

export class PrismaUserRepository implements UserRepository {
  async create({ username, email, password }: UserProps): Promise<User> {
    try {
      if (!(await this.verifyValidUsername(username)))
        throw new ConflictError('Username already in use');
      if (!(await this.verifyValidEmail(email)))
        throw new ConflictError('Email already in use');
      const data = await User.create({ username, email, password });
      return await prisma.user.create({ data });
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async fetchByUsername(username: string): Promise<User> {
    try {
      const fetchedUser = await prisma.user.findUnique({
        where: { username },
      });
      if (!fetchedUser) throw new NotFoundError('User not found');
      return fetchedUser;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  private async verifyValidEmail(email: string): Promise<boolean> {
    try {
      if (
        await prisma.user.findUnique({
          where: { email },
        })
      )
        return false;
      return true;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  private async verifyValidUsername(username: string): Promise<boolean> {
    try {
      if (
        await prisma.user.findUnique({
          where: { username },
        })
      )
        return false;
      return true;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
