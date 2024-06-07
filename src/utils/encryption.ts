import { compare, hash } from 'bcryptjs';
import { AES, enc } from 'crypto-js';

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 10);
}

export async function compareHash(
  inputPassword: string,
  userPassword: string,
): Promise<boolean> {
  const passwordMatch = await compare(inputPassword, userPassword);
  return passwordMatch;
}

export function encryptPassword(plainPassword: string, secret: string): string {
  return AES.encrypt(plainPassword, secret).toString();
}

export function decryptPassword(
  encryptedPassword: string,
  secret: string,
): string {
  const bytes = AES.decrypt(encryptedPassword, secret);
  return bytes.toString(enc.Utf8);
}
