import { randomUUID } from 'node:crypto';

export class Vault {
  id: string = randomUUID();
  userId: string;
  name: string;
  color: string;

  constructor(name: string, color: string, userId: string) {
    this.name = name;
    this.color = color;
    this.userId = userId;
  }
}
