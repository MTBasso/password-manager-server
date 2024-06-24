import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { DeleteCredentialUseCase } from './delete.usecase';

export class DeleteCredentialController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new DeleteCredentialUseCase();

    try {
      const credentialId = request.params.credentialId;
      if (!credentialId) throw new BadRequestError();

      await useCase.execute(credentialId);

      return response
        .status(200)
        .json({ message: 'Credential deleted successfully.' });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });

      return response.status(500).json({ message: 'Internal server error' });
    }
  };
}
