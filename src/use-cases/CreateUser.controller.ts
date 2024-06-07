import { Request, Response } from "express";
import { BadRequestError, InternalServerError, isCustomError } from "../errors/Error";
import { InMemoryUserRepository } from "../repositories/user.inMemory";
import { CreateUserUseCase } from "./CreateUser.use-case";

export class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const useCase = new CreateUserUseCase(new InMemoryUserRepository());
    try {
      const {username, email, password} = request.body;
      if(!username || !email || !password) throw new BadRequestError();
      await useCase.execute({username, email, password})
      return response.status(201).json({message: 'User created successfully'})
    } catch (error) {
      if(isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}