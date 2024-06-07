import { randomUUID } from "crypto";
import { User } from "./user";

export interface VaultProps {
  name: string;
  userId: string;
}

interface VaultConstructorProps {
  name: string;
  user: User;
}

export class Vault {
  id: string;
  name: string;
  // credentials?: Credential[]
  user: User
  userId: string
  
  constructor({name, user}: VaultConstructorProps) {
    this.id = randomUUID();
    this.name = name;
    this.user = user
    this.userId = user.id;
  }
}