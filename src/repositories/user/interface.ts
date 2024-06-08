import type { Vault } from '@prisma/client';
import type { User } from '../../entities/user';

export interface UserRepository {
  users?: User[];
  create(user: User): Promise<User>;
  fetchByUsername(username: string): Promise<User>;
  deleteByUsername(username: string): Promise<void>;
}
