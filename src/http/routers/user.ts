import { Router } from 'express';
import { CreateUserController } from '../../use-cases/user/create.controller';
import { FetchUserByUsernameController } from '../../use-cases/user/fetchUsername.controller';

export const userRouter = Router();

userRouter.post('/register', new CreateUserController().handle);
userRouter.get(
  '/fetch-by-username',
  new FetchUserByUsernameController().handle,
);
