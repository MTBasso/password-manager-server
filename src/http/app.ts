import express from 'express';
import 'reflect-metadata';
import { localRepository } from '../repositories/inMemory';
import { userRouter } from './routers/user';
import { vaultRouter } from './routers/vault';

export const app = express();

export const activeRepository = localRepository;

app.use(express.json());

app.use('/user', userRouter);
app.use('/vault', vaultRouter);
