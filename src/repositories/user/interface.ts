import type { User } from '../../entities/user';
import type { SaveUserResponseType, loginResponse } from './prisma';

export interface UserRepository {
  users?: User[];
  save(user: User): Promise<SaveUserResponseType>;
  login(email: string, password: string): Promise<loginResponse>;
  fetchById(id: string): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}
