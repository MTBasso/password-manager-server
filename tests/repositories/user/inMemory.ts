import { compare, hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { User } from '../../../src/entities/user';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../../src/errors/Error';
import type { UserRepository } from '../../../src/repositories/user/interface';
import { localRepository } from '../inMemory';

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [];

  async save(user: User): Promise<User> {
    this.verifyNonConflictingUsername(user.username);
    this.verifyNonConflictingEmail(user.email);
    this.users.push(user);
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = this.users.find((user: User) => user.email === email);
    if (!user) throw new NotFoundError('User not found');

    const isPasswordValid = await this.compareHash(password, user.password);
    if (!isPasswordValid)
      throw new UnauthorizedError('Password does not match');

    return sign({ id: user.id }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });
  }

  async fetchById(id: string): Promise<User> {
    const fetchedUser = this.users.find((user: User) => user.id === id);
    if (!fetchedUser) throw new NotFoundError('User not found');
    return fetchedUser;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    const index = this.users.findIndex((user: User) => user.id === id);
    if (index === -1) throw new NotFoundError('User not found');

    const userToUpdate = this.users[index];

    if (data.username && this.verifyNonConflictingUsername(data.username))
      throw new ConflictError('Username already in use');
    userToUpdate.username = data.username!;

    if (data.email && this.verifyNonConflictingEmail(data.email))
      throw new ConflictError('Email already in use');
    userToUpdate.email = data.email!;

    if (data.password && !User.isStrongPassword(data.password))
      throw new BadRequestError(
        'The password should be at least 8 characters long, contain upper and lower case letters, at least 1 number, and 1 special characters',
      );
    userToUpdate.password = await this.hashPassword(data.password!);

    this.users[index] = userToUpdate;
    return userToUpdate;
  }

  async delete(id: string): Promise<void> {
    const userToDelete = await localRepository.user.fetchById(id);
    if (!userToDelete) throw new NotFoundError('User not found');
    this.users = this.users.filter((user) => user.id !== userToDelete.id);
  }

  private async hashPassword(password: string): Promise<string> {
    return await hash(password, 10);
  }

  private async compareHash(
    inputPassword: string,
    userPassword: string,
  ): Promise<boolean> {
    const passwordMatch = await compare(inputPassword, userPassword);
    return passwordMatch;
  }

  private verifyNonConflictingUsername(username: string) {
    if (this.users.some((user: User) => user.username === username))
      return true;
    return false;
  }

  private verifyNonConflictingEmail(email: string) {
    if (this.users.some((user: User) => user.email === email)) return true;
    return false;
  }
}
