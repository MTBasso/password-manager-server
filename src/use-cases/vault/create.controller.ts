import type { Request, Response } from 'express';
import { Vault } from '../../entities/vault';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { CreateVaultUseCase } from './create.usecase';

interface CreateVaultControllerRequestProps {
  name: string;
  color: string;
}

export class CreateVaultController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new CreateVaultUseCase();

    try {
      const userId = request.headers.userid;
      this.validateCreateVaultRequest(request.body);
      const { name, color } = request.body;

      const createdVault = await useCase.execute(
        new Vault(name, color, userId as string),
      );

      return response
        .status(201)
        .json({ message: 'Vault created successfully', vault: createdVault });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });

      return response.status(500).json({ error: 'Internal server error' });
    }
  };

  private validateCreateVaultRequest(body: CreateVaultControllerRequestProps) {
    if (!body.name) throw new BadRequestError('Vault Name is required');
    if (!body.color) throw new BadRequestError('Vault Color is required');
  }
}
