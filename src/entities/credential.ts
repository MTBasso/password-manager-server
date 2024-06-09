import { randomUUID } from 'node:crypto';
import { InternalServerError, isCustomError } from '../errors/Error';
import { encryptPassword } from '../utils/encryption';

export class Credential {
  id: string = randomUUID();
  vaultId: string;
  name: string;
  login: string;
  password: string;

  constructor(
    name: string,
    login: string,
    password: string,
    vaultId: string,
    userSecret: string,
  ) {
    try {
      this.vaultId = vaultId;
      this.name = name;
      this.login = login;
      this.password = encryptPassword(password, userSecret);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
