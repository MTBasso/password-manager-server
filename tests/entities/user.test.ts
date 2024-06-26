import { User } from '../../src/entities/user';
import { BadRequestError } from '../../src/errors/Error';

describe('User Entity', () => {
  const validUserData = {
    username: 'Jest',
    email: 'jest@test.com',
    password: 'JestPass123!',
  };

  describe('Constructor', () => {
    it('Should create a User successfully.', () => {
      expect(
        new User(
          validUserData.username,
          validUserData.email,
          validUserData.password,
        ),
      ).toBeInstanceOf(User);
    });

    it('Should throw BadRequestError for invalid email.', () => {
      try {
        const user = new User(
          validUserData.username,
          'invalidEmail',
          validUserData.password,
        );
        if (user) fail('No user expected');
      } catch (error) {
        if (error instanceof BadRequestError) {
          expect(error.message).toBe('Invalid email.');
        } else {
          fail('Expected BadRequestError');
        }
      }
    });

    it('Should throw BadRequestError for weak password.', () => {
      try {
        const user = new User(
          validUserData.username,
          validUserData.email,
          'weakPassword',
        );
        if (user) fail('No User expected');
      } catch (error) {
        if (error instanceof BadRequestError) {
          expect(error.message).toBe(
            'The password should be at least 8 characters long, contain upper and lower case letters, at least 1 number, and 1 special characters',
          );
        } else {
          fail('Expected BadRequestError');
        }
      }
    });
  });
});
