import express from 'express';
import 'reflect-metadata';
import { InMemoryUserRepository } from '../repositories/user/user.inMemory';
import { PrismaUserRepository } from '../repositories/user/user.prisma';
import { userRouter } from './routes/user';

export const app = express();
export const inMemoryUserRepository = new InMemoryUserRepository();
export const prismaUserRepository = new PrismaUserRepository();

app.use(express.json());

app.use(userRouter);
