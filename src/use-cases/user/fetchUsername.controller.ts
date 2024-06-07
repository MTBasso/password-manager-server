import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { prismaUserRepository } from '../../http/app';
import { FetchUserByUsernameUseCase } from './fetchUsername.usecase';

export class FetchUserByUsernameController {
  async handle(request: Request, response: Response): Promise<Response> {
    const useCase = new FetchUserByUsernameUseCase(prismaUserRepository);
    try {
      const username = request.body.username;
      if (!username) throw new BadRequestError();
      const fetchedUser = await useCase.execute(username);
      return response
        .status(200)
        .json({ message: 'User fetched successfully ', user: fetchedUser });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json(error.message);
      return response.status(500).json({ message: 'Internal server error' });
    }
  }
}
