import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { DeleteUserUseCase } from './delete.usecase';

export class DeleteUserController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new DeleteUserUseCase();
    try {
      const userId = request.params.userId;
      if (!userId) throw new BadRequestError();
      await useCase.execute(userId);
      return response
        .status(200)
        .json({ message: 'User deleted successfully.' });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });
      return response.status(500).json({ message: 'Internal server error' });
    }
  };
}
