import type { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import { ReadUserUseCase } from './read.usecase';

export class ReadUserController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new ReadUserUseCase();

    try {
      const userId = request.params.userId;
      if (!userId) throw new BadRequestError();

      const fetchedUser = await useCase.execute(userId);
      if (!fetchedUser) throw new NotFoundError('User not found');

      return response
        .status(200)
        .json({ message: 'User fetched successfully ', user: fetchedUser });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });

      return response.status(500).json({ message: 'Internal server error' });
    }
  };
}
