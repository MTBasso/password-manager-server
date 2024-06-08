import { User } from '../../src/entities/user';
import { BadRequestError } from '../../src/errors/Error';

describe('User Entity', () => {
  const validUserData = {
    username: 'Jest',
    email: 'jest@test.com',
    password: 'JestPass123!',
  };

  describe('Constructor', () => {
    const { username, email, password } = validUserData;
    it('Should create a User successfully.', () => {
      expect(new User(username, email, password)).toBeInstanceOf(User);
    });

    it('Should throw BadRequestError for invalid email.', () => {
      try {
        const user = new User(username, 'invalidEmail', password);
        if (user) fail('No user expected');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe('Invalid email.');
      }
    });

    it('Should throw BadRequestError for weak password.', () => {
      try {
        const user = new User(username, email, 'weakPassword');
        if (user) fail('No User expected');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe(
          'The password should be at least 8 characters long, contain upper and lower case letters, at least 1 number, and 1 special characters',
        );
      }
    });
  });
});
