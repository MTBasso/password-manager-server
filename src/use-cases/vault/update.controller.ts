import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { UpdateVaultUseCase } from './update.usecase';

export class UpdateVaultController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new UpdateVaultUseCase();
    try {
      const vaultId = request.params.vaultId;
      if (!request.body.name) throw new BadRequestError('Name is required');
      const updatedVault = await useCase.execute(vaultId, request.body.name);
      return response
        .status(200)
        .json({ message: 'Vault updated successfully', vault: updatedVault });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });
      return response.status(500).json({ message: 'Internal server error' });
    }
  };
}
