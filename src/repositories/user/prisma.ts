import { compare, hash } from 'bcryptjs';
import { prisma } from '../../../prisma';
import { User } from '../../entities/user';
import type { Vault } from '../../entities/vault';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../errors/Error';
import type { UserRepository } from './interface';

export class PrismaUserRepository implements UserRepository {
  async save(user: User): Promise<User> {
    await this.verifyValidUsername(user.username);
    await this.verifyValidEmail(user.email);
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

  async fetchById(id: string): Promise<User> {
    const fetchedUser = await prisma.user.findUnique({
      where: { id },
    });
    if (!fetchedUser) throw new NotFoundError('User not found');
    return fetchedUser;
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    if (!(await this.fetchById(id))) throw new NotFoundError('User not found');
    if (data.username && !(await this.verifyValidUsername(data.username)))
      throw new ConflictError('Username is already in use');
    if (data.email && !(await this.verifyValidEmail(data.email)))
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

  private async verifyValidUsername(username: string) {
    if (
      await prisma.user.findUnique({
        where: { username },
      })
    )
      return false;
  }

  private async verifyValidEmail(email: string) {
    if (
      await prisma.user.findUnique({
        where: { email },
      })
    )
      return false;
  }
}
