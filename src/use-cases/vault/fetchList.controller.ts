import type { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import { FetchVaultListByIdUseCase } from './fetchList.usecase';

export class FetchVaultListByIdController {
  async handle(request: Request, response: Response): Promise<Response> {
    const useCase = new FetchVaultListByIdUseCase();
    try {
      const userId = request.params.userId;
      if (!userId) throw new BadRequestError();
      const userVaultList = await useCase.execute(userId);
      if (!userVaultList) throw new NotFoundError('User has no vaults');
      return response.status(200).json({
        message: 'User vault list fetched successfully',
        vaults: userVaultList,
      });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json('error no controlerr');
      return response.status(500).json({ message: 'Internal server error' });
    }
  }
}
