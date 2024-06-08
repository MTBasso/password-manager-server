import { User, type UserProps } from '../../entities/user';
import { NotFoundError } from '../../errors/Error';
import type { UserRepository } from './interface';

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [];

  async create(props: UserProps): Promise<User> {
    const createdUser = await User.create(props);
    this.users.push(createdUser);
    return createdUser;
  }

  async fetchByUsername(username: string): Promise<User> {
    const fetchedUser = this.users.find((user) => user.username === username);
    if (!fetchedUser) throw new NotFoundError('User not found');
    return fetchedUser;
  }

  async fetchById(id: string): Promise<User> {
    const fetchedUser = this.users.find((user) => user.id === id);
    if (!fetchedUser) throw new NotFoundError('User not found');
    return fetchedUser;
  }
}
