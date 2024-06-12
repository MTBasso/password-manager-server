import {
  InternalServerError,
  UnauthorizedError,
  isCustomError,
} from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';
import type { loginResponse } from '../../repositories/user/prisma';

export class LoginUserUseCase {
  async execute(email: string, password: string): Promise<loginResponse> {
    try {
      const loginResponse = await prismaRepository.user.login(email, password);
      if (!loginResponse) throw new UnauthorizedError('Failed to login');
      return loginResponse;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError('usecase: Failed to login');
    }
  }
}
