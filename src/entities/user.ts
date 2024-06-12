import { randomUUID } from 'node:crypto';
import { BadRequestError } from '../errors/Error';

export class User {
  id: string = randomUUID();
  username: string;
  email: string;
  password: string;
  secret: string = randomUUID();

  constructor(username: string, email: string, password: string) {
    if (!User.isValidEmail(email)) throw new BadRequestError('Invalid email.');
    if (!User.isStrongPassword(password))
      throw new BadRequestError(
        'The password should be at least 8 characters long, contain upper and lower case letters, at least 1 number, and 1 special characters',
      );
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(email)) return true;
    return false;
  }

  static isStrongPassword(password: string): boolean {
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if (strongPasswordRegex.test(password)) return true;
    return false;
  }
}
