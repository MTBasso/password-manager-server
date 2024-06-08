import { randomUUID } from 'node:crypto';
import { InternalServerError, isCustomError } from '../errors/Error';
import { activeRepository } from '../repositories/active';
import { isStrongPassword, isValidEmail } from '../utils/validations';
import type { Vault } from './vault';

export interface UserProps {
  username: string;
  email: string;
  password: string;
}

export class User {
  id: string = randomUUID();
  username: string;
  email: string;
  password: string;
  secret: string = randomUUID();
  vault?: Vault[] = [];

  private constructor({ username, email, password }: UserProps) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  static async create({ username, email, password }: UserProps): Promise<User> {
    try {
      isValidEmail(email);
      isStrongPassword(password);
      return await activeRepository.userRepository.create(
        new User({ username, email, password }),
      );
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  static async getByUsername(username: string): Promise<User> {
    try {
      return await activeRepository.userRepository.fetchByUsername(username);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  static async delete(username: string) {
    try {
      activeRepository.userRepository.deleteByUsername(username);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  // static async getUserVaults(userId: string) {
  //   try {
  //     return await activeRepository.vaultRepository.fetchUserVaults(userId);
  //   } catch (error) {
  //     if (isCustomError(error)) throw error;
  //     throw new InternalServerError();
  //   }
  // }
}
