import express from 'express';
import type { User } from '../entities/user';

declare module 'express' {
  interface Request {
    user?: Partial<User>;
  }
}
