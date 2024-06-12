import { randomUUID } from 'node:crypto';

export class Credential {
  id: string = randomUUID();
  vaultId: string;
  name: string;
  login: string;
  password: string;

  constructor(name: string, login: string, password: string, vaultId: string) {
    this.vaultId = vaultId;
    this.name = name;
    this.login = login;
    this.password = password;
  }
}
