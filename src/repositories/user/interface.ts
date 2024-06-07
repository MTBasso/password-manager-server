import type { User, UserProps } from '../../entities/user';

export interface UserRepository {
  users?: User[];
  create({ username, email, password }: UserProps): Promise<User>;
  fetchByUsername(username: string): Promise<User>;
}
