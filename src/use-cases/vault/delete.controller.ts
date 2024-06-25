import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { DeleteVaultUseCase } from './delete.usecase';

export class DeleteVaultController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new DeleteVaultUseCase();

    try {
      const vaultId = request.params.vaultId;
      if (!vaultId) throw new BadRequestError();

      await useCase.execute(vaultId);

      return response
        .status(200)
        .json({ message: 'Vault deleted successfully' });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });

      return response.status(500).json({ error: 'Internal server error' });
    }
  };
}
