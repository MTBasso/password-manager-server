import type { User } from '../../entities/user';

export interface UserRepository {
  users?: User[];
  save(user: User): Promise<User>;
  fetchById(id: string): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
