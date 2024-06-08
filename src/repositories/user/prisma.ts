import type { Vault } from '@prisma/client';
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
  async create(user: User): Promise<User> {
    try {
      PrismaUserRepository.checkNonExistent(user.username, user.email);
      return await prisma.user.create({ data: { ...user, vault: undefined } });
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

  private static async checkNonExistent(username: string, email: string) {
    if (
      await prisma.user.findUnique({
        where: { username },
      })
    )
      throw new ConflictError('Username already in use.');
    if (
      await prisma.user.findUnique({
        where: { email },
      })
    )
      throw new ConflictError('Email already in use.');
  }

  async deleteByUsername(username: string) {
    try {
      await prisma.user.delete({
        where: { username },
      });
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
