import { UserProps } from "../../entities/user";
import { InternalServerError, isCustomError } from "../../errors/Error";
import { UserRepository } from "../../repositories/user.interface";

export class CreateUserUseCase {
  constructor(private userRepository: UserRepository) {}

  async execute({username, email, password }: UserProps) {
    try {
      return await this.userRepository.create({
        username,
        email, 
        password
      })
    } catch (error) {
      if(isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
