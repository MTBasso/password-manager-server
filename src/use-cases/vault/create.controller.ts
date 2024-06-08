import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { CreateVaultUseCase } from './create.usecase';

export class CreateVaultController {
  async handle(request: Request, response: Response): Promise<Response> {
    const useCase = new CreateVaultUseCase();
    try {
      const { name, userId } = request.body;
      if (!name || !userId) throw new BadRequestError();
      const createdVault = await useCase.execute({ name, userId });
      return response
        .status(201)
        .json({ message: 'Vault created successfully', vault: createdVault });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json(error.message);
      return response.status(500).json({ message: 'Internal server error' });
    }
  }
}
