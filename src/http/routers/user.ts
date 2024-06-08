import { Router } from 'express';
import { CreateUserController } from '../../use-cases/user/create.controller';
import { ReadUserController } from '../../use-cases/user/read.controller';

export const userRouter = Router();

userRouter.post('/register', new CreateUserController().handle);
userRouter.get('/fetch/:userId', new ReadUserController().handle);
