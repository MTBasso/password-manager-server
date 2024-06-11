import { Router } from 'express';
import { CreateUserController } from '../../use-cases/user/create.controller';
import { DeleteUserController } from '../../use-cases/user/delete.controller';
import { ReadUserController } from '../../use-cases/user/read.controller';
import { UpdateUserController } from '../../use-cases/user/update.controller';

export const userRouter = Router();

userRouter.post('/register', new CreateUserController().handle);
userRouter.get('/read/:userId', new ReadUserController().handle);
userRouter.patch('/update/:userId', new UpdateUserController().handle);
userRouter.delete('/delete/:userId', new DeleteUserController().handle);
