import type { Request, Response } from 'express';
import { User } from '../../entities/user';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { CreateUserUseCase } from './create.usecase';

interface CreateUserControllerRequestProps {
  username: string;
  email: string;
  password: string;
}

export class CreateUserController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new CreateUserUseCase();
    try {
      this.validateCreateUserControllerBody(request.body);
      const { username, email, password } = request.body;
      const createdUser = await useCase.execute(
        new User(username, email, password),
      );
      return response
        .status(201)
        .json({ message: 'User created successfully', user: createdUser });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json(error.message);
      return response.status(500).json({ message: 'Internal server error' });
    }
  };

  private validateCreateUserControllerBody(
    body: CreateUserControllerRequestProps,
  ) {
    if (!body.username) throw new BadRequestError('Username is required');
    if (!body.email) throw new BadRequestError('Email is required');
    if (!body.password) throw new BadRequestError('Password is required');
  }
}
