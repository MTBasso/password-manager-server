import { compare, hash } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../../../prisma';
import { User } from '../../entities/user';
import type { Vault } from '../../entities/vault';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from '../../errors/Error';
import type { UserRepository } from './interface';

export type loginResponse = { token: string; userId: string };

export class PrismaUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    await this.checkUsernameConflict(user.username);
    await this.checkEmailConflict(user.email);
    return await prisma.user.create({
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        password: await this.hashPassword(user.password),
        secret: user.secret,
      },
    });
  }

  async login(email: string, password: string): Promise<loginResponse> {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundError('User not found');
    if (!(await this.compareHash(password, user.password)))
      throw new UnauthorizedError('Password does not match');
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET ?? '', {
      expiresIn: '1h',
    });
    return { token, userId: user.id };
  }

  async fetchById(id: string): Promise<User> {
    const fetchedUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!fetchedUser) throw new NotFoundError('User not found');
    return fetchedUser;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    if (!(await this.fetchById(id))) throw new NotFoundError('User not found');
    if (data.username && (await this.checkUsernameConflict(data.username)))
      throw new ConflictError('Username is already in use');
    if (data.email && (await this.checkEmailConflict(data.email)))
      throw new ConflictError('Email is already in use');
    if (data.password && !User.isStrongPassword(data.password))
      throw new BadRequestError(
        'The password should be at least 8 characters long, contain upper and lower case letters, at least 1 number, and 1 special characters',
      );
    data.password = await this.hashPassword(data.password!);
    return await prisma.user.update({
      where: { id },
      data,
    });
  }

  async delete(userId: string) {
    if (!(await this.fetchById(userId)))
      throw new NotFoundError('User not found');
    const userVaults: Vault[] = await prisma.vault.findMany({
      where: { userId },
    });
    for (const vault of userVaults) {
      await prisma.credential.deleteMany({ where: { vaultId: vault.id } });
      await prisma.vault.delete({ where: { id: vault.id } });
    }
    await prisma.user.delete({ where: { id: userId } });
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

  private async checkUsernameConflict(username: string) {
    if (
      await prisma.user.findUnique({
        where: { username },
      })
    )
      return true;
  }

  private async checkEmailConflict(email: string) {
    if (
      await prisma.user.findUnique({
        where: { email },
      })
    )
      return true;
  }
}
