import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { UpdateUserUseCase } from './update.usecase';

interface UpdateUserControllerRequestProps {
  username?: string;
  email?: string;
  password?: string;
}

export class UpdateUserController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new UpdateUserUseCase();

    try {
      const userId = request.params.userId;
      this.validateUpdateUserControllerBody(request.body);

      const updatedUser = await useCase.execute(userId, request.body);

      return response
        .status(200)
        .json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });

      return response.status(500).json({ message: 'Internal server error' });
    }
  };

  private validateUpdateUserControllerBody(
    body: UpdateUserControllerRequestProps,
  ) {
    if (!body.username && !body.email && !body.password)
      throw new BadRequestError('At least one field is required');
  }
}
