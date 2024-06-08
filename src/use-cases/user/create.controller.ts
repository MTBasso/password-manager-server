import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { inMemoryUserRepository, prismaUserRepository } from '../../http/app';
import { CreateUserUseCase } from './create.usecase';

export class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const useCase = new CreateUserUseCase(inMemoryUserRepository);
    try {
      const { username, email, password } = request.body;
      if (!username || !email || !password) throw new BadRequestError();
      const createdUser = await useCase.execute({ username, email, password });
      return response
        .status(201)
        .json({ message: 'User created successfully', user: createdUser });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json(error.message);
      return response.status(500).json({ message: 'Internal server error' });
    }
  }
}
