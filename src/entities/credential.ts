import { randomUUID } from 'node:crypto';

export class Credential {
  id: string = randomUUID();
  vaultId: string;
  name: string;
  website: string;
  login: string;
  password: string;

  constructor(
    name: string,
    website: string,
    login: string,
    password: string,
    vaultId: string,
  ) {
    this.vaultId = vaultId;
    this.name = name;
    this.website = website;
    this.login = login;
    this.password = password;
  }
}
