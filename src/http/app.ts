import express from 'express'
import 'reflect-metadata';
import { userRouter } from './routes/user';

export const app = express();

app.use(express.json())

app.use(userRouter)
