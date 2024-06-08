import { randomUUID } from 'node:crypto';
import { InternalServerError, isCustomError } from '../errors/Error';
import { activeRepository } from '../repositories/active';
import type { User } from './user';

export interface VaultProps {
  name: string;
  userId: string;
}

export class Vault {
  id: string;
  name: string;
  // credential: Credential[];
  user?: User;
  userId: string;

  private constructor(name: string, user: User) {
    this.id = randomUUID();
    this.name = name;
    this.user = user;
    this.userId = user.id;
  }

  static async create({ name, userId }: VaultProps): Promise<Vault> {
    try {
      const user = await activeRepository.userRepository.fetchById(userId);
      const createdVault = new Vault(name, user);
      user.vault?.push(createdVault);
      return activeRepository.vaultRepository.create(createdVault);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  static async getUserVaults(userId: string): Promise<Vault[]> {
    try {
      return await activeRepository.vaultRepository.fetchUserVaults(userId);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
