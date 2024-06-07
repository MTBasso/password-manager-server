import { InternalServerError, isCustomError } from "../../errors/Error";
import { UserRepository } from "../../repositories/user.interface";

export class FetchUserByUsernameUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute(username: string) {
    try {
      return await this.userRepository.fetchByUsername(username)
    } catch (error) {
      if(isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}