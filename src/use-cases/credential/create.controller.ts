import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { CreateCredentialUseCase } from './create.usecase';

interface CreateCredentialControllerRequestProps {
  name: string;
  login: string;
  website: string;
  password: string;
  vaultId: string;
}

export class CreateCredentialController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new CreateCredentialUseCase();

    try {
      this.validateCreateCredentialControllerBody(request.body);
      const createdCredential = await useCase.execute(request.body);

      return response.status(201).json({
        message: 'Credential created successfully',
        credential: {
          id: createdCredential.id,
          name: createdCredential.name,
          website: createdCredential.website,
          login: createdCredential.login,
          encryptedPassword: createdCredential.password,
        },
      });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });

      return response.status(500).json({ error: 'Internal server error' });
    }
  };

  private validateCreateCredentialControllerBody(
    body: CreateCredentialControllerRequestProps,
  ) {
    if (!body.name) throw new BadRequestError('Username is required');
    if (!body.website) throw new BadRequestError('Website is required');
    if (!body.login) throw new BadRequestError('Login is required');
    if (!body.password) throw new BadRequestError('Password is required');
    if (!body.vaultId) throw new BadRequestError('Vault Id is required');
  }
}
