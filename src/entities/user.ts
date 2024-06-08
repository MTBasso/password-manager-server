import { randomUUID } from 'node:crypto';
import { InternalServerError, isCustomError } from '../errors/Error';
import { isStrongPassword, isValidEmail } from '../utils/validations';

export class User {
  id: string = randomUUID();
  username: string;
  email: string;
  password: string;
  secret: string = randomUUID();

  constructor(username: string, email: string, password: string) {
    try {
      isValidEmail(email);
      isStrongPassword(password);
      this.username = username;
      this.email = email;
      this.password = password;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
