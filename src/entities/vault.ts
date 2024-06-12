import { randomUUID } from 'node:crypto';

export class Vault {
  id: string = randomUUID();
  userId: string;
  name: string;

  constructor(name: string, userId: string) {
    this.userId = userId;
    this.name = name;
  }
}
