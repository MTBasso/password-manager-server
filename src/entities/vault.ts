import { randomUUID } from 'node:crypto';
import { InternalServerError, isCustomError } from '../errors/Error';

export class Vault {
  id: string = randomUUID();
  userId: string;
  name: string;

  constructor(name: string, userId: string) {
    try {
      this.userId = userId;
      this.name = name;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
