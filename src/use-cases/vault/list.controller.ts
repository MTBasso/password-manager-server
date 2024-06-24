import type { Request, Response } from 'express';
import { BadRequestError, isCustomError } from '../../errors/Error';
import { ListVaultsUseCase } from './list.usecase';

export class ListVaultsController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new ListVaultsUseCase();

    try {
      const userId = request.params.userId;
      if (!userId) throw new BadRequestError();

      const fetchedVaultList = await useCase.execute(userId);

      return response.status(200).json({
        message: 'Vaults listed successfully',
        vaults: fetchedVaultList,
      });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });

      return response.status(500).json({ message: 'Internal server error' });
    }
  };
}
