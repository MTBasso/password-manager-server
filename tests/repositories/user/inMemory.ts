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
import type {
  SaveUserResponseType,
  loginResponse,
} from '../../../src/repositories/user/prisma';

export class InMemoryUserRepository implements UserRepository {
  LOCAL_JWT = 'test';
  users: User[] = [];

  async save(user: User): Promise<SaveUserResponseType> {
    if (await this.checkUsernameConflict(user.username))
      throw new ConflictError('Username is already in use');

    if (await this.checkEmailConflict(user.email))
      throw new ConflictError('Email is already in use');

    user.password = await this.hashPassword(user.password);
    this.users.push(user);

    const token = sign(
      { userId: user.id },
      process.env.JWT_SECRET ?? this.LOCAL_JWT,
      {
        expiresIn: '1h',
      },
    );

    return { user, token };
  }

  async login(email: string, password: string): Promise<loginResponse> {
    const user = this.users.find((user: User) => user.email === email);
    if (!user) throw new NotFoundError('User not found');

    if (!(await this.compareHash(password, user.password)))
      throw new UnauthorizedError('Password does not match');

    const token = sign(
      { userId: user.id },
      process.env.JWT_SECRET ?? this.LOCAL_JWT,
      {
        expiresIn: '1h',
      },
    );

    return { token, userId: user.id };
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

    if (data.username) {
      if (await this.checkUsernameConflict(data.username))
        throw new ConflictError('Username already in use');
      userToUpdate.username = data.username;
    }

    if (data.email) {
      if (await this.checkEmailConflict(data.email))
        throw new ConflictError('Email already in use');
      userToUpdate.email = data.email!;
    }

    if (data.password) {
      if (!User.isStrongPassword(data.password))
        throw new BadRequestError(
          'The password should be at least 8 characters long, contain upper and lower case letters, at least 1 number, and 1 special characters',
        );
      userToUpdate.password = await this.hashPassword(data.password!);
    }

    this.users[index] = userToUpdate;

    return userToUpdate;
  }

  async delete(userId: string): Promise<void> {
    const userToDelete = await this.fetchById(userId);
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
    return await compare(inputPassword, userPassword);
  }

  private async checkUsernameConflict(username: string): Promise<boolean> {
    return this.users.some((user: User) => user.username === username);
  }

  private async checkEmailConflict(email: string): Promise<boolean> {
    return this.users.some((user: User) => user.email === email);
  }
}
