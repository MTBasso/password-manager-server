import express from 'express';
import 'reflect-metadata';
import { InMemoryUserRepository } from '../repositories/user/inMemory';
import { PrismaUserRepository } from '../repositories/user/prisma';
import { InMemoryVaultRepository } from '../repositories/vault/inMemory';
import { userRouter } from './routers/user';
import { vaultRouter } from './routers/vault';

export const app = express();
export const inMemoryUserRepository = new InMemoryUserRepository();
export const prismaUserRepository = new PrismaUserRepository();
export const inMemoryVaultRepository = new InMemoryVaultRepository();

app.use(express.json());

app.use('/user',userRouter);
app.use('/vault', vaultRouter)
