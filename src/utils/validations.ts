import { BadRequestError } from '../errors/Error';

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email)) return true;
  throw new BadRequestError('Invalid email.');
}

export function isStrongPassword(password: string): boolean {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
  if (strongPasswordRegex.test(password)) return true;
  throw new BadRequestError(
    'The password should be at least 8 characters long, contain upper and lower case letters, at least 1 number, and 1 special characters',
  );
}
