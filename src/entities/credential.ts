import { randomUUID } from 'node:crypto';
import { InternalServerError, isCustomError } from '../errors/Error';

export class Credential {
  id: string = randomUUID();
  vaultId: string;
  name: string;
  login: string;
  password: string;

  constructor(name: string, login: string, password: string, vaultId: string) {
    try {
      this.vaultId = vaultId;
      this.name = name;
      this.login = login;
      this.password = password;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
