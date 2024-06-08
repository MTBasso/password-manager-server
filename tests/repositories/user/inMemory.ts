import type { User } from '../../../src/entities/user';
import { ConflictError, NotFoundError } from '../../../src/errors/Error';
import type { UserRepository } from '../../../src/repositories/user/interface';

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [];

  async save(user: User): Promise<User> {
    this.verifyNonConflictingUsername(user.username);
    this.verifyNonConflictingEmail(user.email);
    this.users.push(user);
    return user;
  }

  async fetchById(id: string): Promise<User> {
    const fetchedUser = this.users.find((user: User) => user.id === id);
    if (!fetchedUser) throw new NotFoundError('User not found');
    return fetchedUser;
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }

  private verifyNonConflictingUsername(username: string) {
    if (this.users.some((user: User) => user.username === username))
      throw new ConflictError('Username already in use');
  }

  private verifyNonConflictingEmail(email: string) {
    if (this.users.some((user: User) => user.email === email))
      throw new ConflictError('Email already in use');
  }
}
