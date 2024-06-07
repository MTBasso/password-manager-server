import express from 'express'
import 'reflect-metadata';
import { InMemoryUserRepository } from '../repositories/user.inMemory';
import { userRouter } from './routes/user';

export const app = express();
export const userRepository = new InMemoryUserRepository();

app.use(express.json())

app.use(userRouter)
