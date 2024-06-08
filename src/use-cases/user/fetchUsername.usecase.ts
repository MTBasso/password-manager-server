import { User } from '../../entities/user';
import { InternalServerError, isCustomError } from '../../errors/Error';

export class FetchUserByUsernameUseCase {
  async execute(username: string) {
    try {
      return await User.getByUsername(username);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
