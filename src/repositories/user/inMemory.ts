import type { User } from '../../entities/user';
import type { Vault } from '../../entities/vault';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import type { UserRepository } from './interface';

export class InMemoryUserRepository implements UserRepository {
  static users: User[] = [];

  async create(user: User): Promise<User> {
    try {
      InMemoryUserRepository.checkNonExistent(user.username, user.email);
      InMemoryUserRepository.users.push(user);
      return user;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async fetchByUsername(username: string): Promise<User> {
    const fetchedUser = InMemoryUserRepository.users.find(
      (user) => user.username === username,
    );
    if (!fetchedUser) throw new NotFoundError('User not found');
    return fetchedUser;
  }

  async fetchById(id: string): Promise<User> {
    const fetchedUser = InMemoryUserRepository.users.find(
      (user) => user.id === id,
    );
    if (!fetchedUser) throw new NotFoundError('User not found');
    return fetchedUser;
  }

  async deleteByUsername(username: string): Promise<void> {
    try {
      const userIndex = InMemoryUserRepository.users.findIndex(
        (user) => user.username === username,
      );
      if (userIndex === -1) throw new NotFoundError('User not found');
      InMemoryUserRepository.users.splice(userIndex, 1);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  private static checkNonExistent(username: string, email: string) {
    if (InMemoryUserRepository.users.find((user) => user.username === username))
      throw new ConflictError('Username is already in use');
    if (InMemoryUserRepository.users.find((user) => user.email === email))
      throw new ConflictError('Email is already in use');
  }
}
