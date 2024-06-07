import { randomUUID } from "node:crypto";
import { BadRequestError, InternalServerError, isCustomError } from "../errors/Error";

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

  private constructor({username, email, password}: UserProps) {
    this.id = randomUUID();
    this.secret = randomUUID();
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static async create({username, email, password}: UserProps) {
    try {
      this.isValidEmail(email);
      this.isStrongPassword(password);
      return new User({username, email, password})
    } catch (error) {
      if(isCustomError(error)) throw error
      throw new InternalServerError();
    }
    
  }

  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(emailRegex.test(email)) return true
    throw new BadRequestError('Invalid email.')
  }

  private static isStrongPassword(password: string): boolean {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
    if(strongPasswordRegex.test(password)) return true;
    throw new BadRequestError(
      'The password should be at least 8 characters long, contain upper and lower case letters, at least 1 number, and 1 special characters'
    )
  }
}