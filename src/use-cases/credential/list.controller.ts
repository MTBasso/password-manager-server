import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { ListCredentialsUseCase } from './list.usecase';

export class ListCredentialsController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new ListCredentialsUseCase();

    try {
      const vaultId = request.params.vaultId;
      if (!vaultId) throw new BadRequestError();

      const fetchedCredentialList = await useCase.execute(vaultId);

      return response.status(200).json({
        message: 'Credentials listed successfully',
        credentials: fetchedCredentialList,
      });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });

      return response.status(500).json({ error: 'Internal server error' });
    }
  };
}
