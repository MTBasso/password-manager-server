import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { UpdateCredentialUseCase } from './update.usecase';

interface UpdateCredentialControllerRequestProps {
  name?: string;
  login?: string;
  website?: string;
  password?: string;
}

export class UpdateCredentialController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new UpdateCredentialUseCase();

    try {
      const credentialId = request.params.credentialId;
      this.validateUpdateVaultControllerBody(request.body);

      const updatedCredential = await useCase.execute(
        credentialId,
        request.body,
      );

      return response.status(200).json({
        message: 'Credential updated successfully',
        credential: updatedCredential,
      });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });

      return response.status(500).json({ error: 'Internal server error' });
    }
  };

  private validateUpdateVaultControllerBody(
    body: UpdateCredentialControllerRequestProps,
  ) {
    if (!body.name && !body.login && !body.website && !body.password)
      throw new BadRequestError('At least one field is required');
  }
}
