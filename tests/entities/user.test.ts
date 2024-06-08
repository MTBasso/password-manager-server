import { User, type UserProps } from '../../src/entities/user';
import { BadRequestError } from '../../src/errors/Error';

describe('User Entity', () => {
  const validUserData: UserProps = {
    username: 'Jest',
    email: 'jest@test.com',
    password: 'JestPass123!',
  };

  describe('create method', () => {
    it('Should create a User successfully.', () => {
      expect(User.create(validUserData)).toBeInstanceOf(User);
    });

    it('Should throw BadRequestError for invalid email.', () => {
      try {
        if (User.create({ ...validUserData, email: 'invalidEmail' }))
          fail('No User expected');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe('Invalid email.');
      }
    });

    it('Should throw BadRequestError for weak password.', () => {
      try {
        if (
          User.create({
            ...validUserData,
            password: 'weakPassword',
          })
        )
          fail('No User expected');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe(
          'The password should be at least 8 characters long, contain upper and lower case letters, at least 1 number, and 1 special characters',
        );
      }
    });
  });
});
