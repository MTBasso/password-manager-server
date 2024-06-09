import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { ReadCredentialUseCase } from './read.usecase';

export class ReadCredentialController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new ReadCredentialUseCase();
    try {
      const credentialId = request.params.credentialId;
      if (!credentialId) throw new BadRequestError();
      const fetchedCredential = await useCase.execute(credentialId);
      return response.status(200).json({
        message: 'Credential fetched successfully',
        Credential: fetchedCredential,
      });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json(error.message);
      return response.status(500).json({ message: 'Internal server error' });
    }
  };
}
