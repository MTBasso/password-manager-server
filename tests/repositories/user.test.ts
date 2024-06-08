import { User, type UserProps } from '../../src/entities/user';
import { localRepository } from '../../src/repositories/inMemory';

describe('User Repository', () => {
  const validUserData: UserProps = {
    username: 'Jest',
    email: 'jest@test.com',
    password: 'JestPass123!',
  };

  describe('create method.', () => {
    it('Should create a User', async () => {
      expect(
        await localRepository.userRepository.create(validUserData),
      ).toBeInstanceOf(User);
    });
  });

  describe('fetchById method.', async () => {
    const createdUser =
      await localRepository.userRepository.create(validUserData);
    it('Should find a user by its id.', async () => {
      expect(
        await localRepository.userRepository.fetchById(createdUser.id),
      ).toBeInstanceOf(User);
    });
  });
});
