import cors from 'cors';
import express from 'express';
import 'reflect-metadata';
import { credentialRouter } from './routers/credential';
import { swaggerRouter } from './routers/swagger';
import { userRouter } from './routers/user';
import { vaultRouter } from './routers/vault';

export const app = express();

app.use(cors());
app.use(express.json());

app.use(swaggerRouter);
app.use('/user', userRouter);
app.use('/vault', vaultRouter);
app.use('/credential', credentialRouter);
