import { Router } from 'express';
import { CreateUserController } from '../../use-cases/user/create.controller';
import { DeleteUserController } from '../../use-cases/user/delete.controller';
import { LoginUserController } from '../../use-cases/user/login.controller';
import { ReadUserController } from '../../use-cases/user/read.controller';
import { UpdateUserController } from '../../use-cases/user/update.controller';
import { authenticateToken, verifyUserId } from '../middlewares/auth';

export const userRouter = Router();

userRouter.post('/register', new CreateUserController().handle);
userRouter.post('/login', new LoginUserController().handle);

userRouter.use(authenticateToken);

userRouter.get('/read/:userId', verifyUserId, new ReadUserController().handle);
userRouter.patch(
  '/update/:userId',
  verifyUserId,
  new UpdateUserController().handle,
);
userRouter.delete(
  '/delete/:userId',
  verifyUserId,
  new DeleteUserController().handle,
);
