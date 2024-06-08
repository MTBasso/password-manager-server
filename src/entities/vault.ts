import { randomUUID } from 'node:crypto';
import { InternalServerError, isCustomError } from '../errors/Error';

export class Vault {
  id: string = randomUUID();
  name: string;
  userId: string;

  constructor(name: string, userId: string) {
    try {
      this.name = name;
      this.userId = userId;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
