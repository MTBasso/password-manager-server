import { User, type UserProps } from '../../src/entities/user';
import { BadRequestError, ConflictError } from '../../src/errors/Error';
import { activeRepository } from '../../src/repositories/active';

describe('User Entity', () => {
  const validUserData: UserProps = {
    username: 'Jest',
    email: 'jest@test.com',
    password: 'JestPass123!',
  };

  beforeAll(async () => {
    await User.create({
      ...validUserData,
      username: 'ExistentUser',
      email: 'existing@test.com',
    });
  });

  describe('create method', () => {
    it('Should create a User successfully.', async () => {
      expect(await User.create(validUserData)).toBeInstanceOf(User);
      await User.delete(validUserData.username);
    });

    it('Should throw BadRequestError for invalid email.', async () => {
      try {
        if (await User.create({ ...validUserData, email: 'invalidEmail' }))
          fail('No User expected');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe('Invalid email.');
      }
    });

    it('Should throw BadRequestError for weak password.', async () => {
      try {
        if (
          await User.create({
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

    it('Should throw ConflictError for conflicting username.', async () => {
      try {
        if (
          await User.create({
            ...validUserData,
            username: 'ExistentUser',
          })
        )
          fail('No user expected');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictError);
        expect(error.message).toBe('Username is already in use');
      }
    });

    it('Should throw ConflictError for conflicting email.', async () => {
      console.log(activeRepository.userRepository.fetchByUsername('Jest'));
      try {
        if (
          await User.create({
            ...validUserData,
            email: 'existing@test.com',
          })
        )
          fail('No user expected');
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictError);
        expect(error.message).toBe('Email is already in use');
      }
    });
  });
});
