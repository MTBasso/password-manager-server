import { randomUUID } from 'node:crypto';
import { InternalServerError, isCustomError } from '../errors/Error';
import { activeRepository } from '../http/app';
import { isStrongPassword, isValidEmail } from '../utils/validations';

export interface UserProps {
  username: string;
  email: string;
  password: string;
}

export class User {
  id: string;
  username: string;
  email: string;
  password: string;
  secret: string;
  private static repository = activeRepository;

  private constructor({ username, email, password }: UserProps) {
    this.id = randomUUID();
    this.secret = randomUUID();
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static create({ username, email, password }: UserProps) {
    try {
      isValidEmail(email);
      isStrongPassword(password);
      return new User({ username, email, password });
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
