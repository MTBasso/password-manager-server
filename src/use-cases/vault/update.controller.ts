import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { UpdateVaultUseCase } from './update.usecase';

interface UpdateVaultControllerRequestProps {
  name?: string;
  color?: string;
}

export class UpdateVaultController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new UpdateVaultUseCase();

    try {
      const vaultId = request.params.vaultId;
      this.validateUpdateVaultControllerBody(request.body);
      const { name, color } = request.body;

      const updatedVault = await useCase.execute(vaultId, name, color);

      return response
        .status(200)
        .json({ message: 'Vault updated successfully', vault: updatedVault });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });

      return response.status(500).json({ error: 'Internal server error' });
    }
  };

  private validateUpdateVaultControllerBody(
    body: UpdateVaultControllerRequestProps,
  ) {
    if (!body.name && !body.color)
      throw new BadRequestError('At least one field is required.');
  }
}
