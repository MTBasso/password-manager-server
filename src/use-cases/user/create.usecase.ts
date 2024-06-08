import { User, type UserProps } from '../../entities/user';
import { InternalServerError, isCustomError } from '../../errors/Error';

export class CreateUserUseCase {
  async execute({ username, email, password }: UserProps) {
    try {
      return await User.create({
        username,
        email,
        password,
      });
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
