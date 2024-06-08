import type { Request, Response } from 'express';
import { Vault } from '../../entities/vault';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { CreateVaultUseCase } from './create.usecase';

interface CreateVaultControllerRequestProps {
  name: string;
  userId: string;
}

export class CreateVaultController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new CreateVaultUseCase();
    try {
      this.validateCreateVaultControllerBody(request.body);
      const { name, userId } = request.body;
      const createdVault = await useCase.execute(new Vault(name, userId));
      return response
        .status(201)
        .json({ message: 'Vault created successfully', vault: createdVault });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json(error.message);
      return response.status(500).json({ message: 'Internal server error' });
    }
  };

  private validateCreateVaultControllerBody(
    body: CreateVaultControllerRequestProps,
  ) {
    if (!body.name) throw new BadRequestError('Username is required');
    if (!body.userId) throw new BadRequestError('Email is required');
  }
}
