import { Request, Response } from "express";
import { BadRequestError, InternalServerError, isCustomError } from "../../errors/Error";
import { userRepository } from "../../http/app";
import { InMemoryUserRepository } from "../../repositories/user.inMemory";
import { FetchUserByUsernameUseCase } from "./fetchUsername.usecase";

export class FetchUserByUsernameController {
  async handle(request: Request, response: Response): Promise<Response> {
    const useCase = new FetchUserByUsernameUseCase(userRepository);
    try {
      const username = request.body.username;
      if(!username) throw new BadRequestError();
      const fetchedUser = await useCase.execute(username);
      return response.status(200).json({message: "User fetched successfully ", user: fetchedUser});
    } catch (error) {
      if(isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}