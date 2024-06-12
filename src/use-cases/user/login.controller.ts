import type { Request, Response } from 'express';
import {
  BadRequestError,
  UnauthorizedError,
  isCustomError,
} from '../../errors/Error';
import { LoginUserUseCase } from './login.usecase';

interface LoginUserControllerRequestProps {
  email: string;
  password: string;
}

export class LoginUserController {
  handle = async (request: Request, response: Response): Promise<Response> => {
    const useCase = new LoginUserUseCase();
    try {
      this.validateLoginUserControllerBody(request.body);
      const { email, password }: LoginUserControllerRequestProps = request.body;
      const { token, userId } = await useCase.execute(email, password);
      if (!token) throw new UnauthorizedError('Login failed');
      response.setHeader('Authorization', `Bearer ${token}`);
      return response
        .status(200)
        .json({ message: 'User logged in successfully', token, userId });
    } catch (error) {
      if (isCustomError(error))
        return response.status(error.statusCode).json({ error: error.message });
      return response.status(500).json({ message: 'Internal server error' });
    }
  };

  private validateLoginUserControllerBody(
    body: LoginUserControllerRequestProps,
  ) {
    if (!body.email) throw new BadRequestError('Email is required');
    if (!body.password) throw new BadRequestError('Password is required');
  }
}
