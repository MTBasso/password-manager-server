import { prisma } from '../../../prisma';
import type { User } from '../../entities/user';
import type { Vault } from '../../entities/vault';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import { hashPassword } from '../../utils/encryption';
import { isStrongPassword } from '../../utils/validations';
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
        password: await hashPassword(user.password),
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
    if (data.password && isStrongPassword(data.password))
      data.password = await hashPassword(data.password);
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
