import { Router } from "express";
import { CreateUserController } from "../../use-cases/CreateUser.controller";

export const userRouter = Router();

userRouter.post('/register', new CreateUserController().handle);