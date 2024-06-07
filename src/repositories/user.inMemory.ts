import { User, UserProps } from "../entities/user";
import { UserRepository } from "./user.interface";

export class InMemoryUserRepository implements UserRepository {
  users: User[] = [];

  async create(props: UserProps): Promise<User> {
    const createdUser = User.create(props)
    this.users.push(createdUser)
    return createdUser;
  }
}