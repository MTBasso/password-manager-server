import { User } from '../../../src/entities/user';
import { ConflictError, NotFoundError } from '../../../src/errors/Error';
import { localRepository } from '../inMemory';

describe('User Repository', () => {
  const validUserData = {
    username: 'saveMethod',
    email: 'saveMethod@test.com',
    password: 'JestPass123!',
  };
  const newUser = new User(
    validUserData.username,
    validUserData.email,
    validUserData.password,
  );

  describe('save method.', () => {
    let existingUser: User;
    beforeEach(() => {
      localRepository.user.users = [];
    });

    it('Should save a User', async () => {
      expect(await localRepository.user.save(newUser)).toBeInstanceOf(User);
    });

    it('Should throw ConflictError for conflicting username', async () => {
      existingUser = await localRepository.user.save(newUser);
      try {
        await localRepository.user.save({
          ...existingUser,
          email: 'different@email.com',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictError);
        expect(error.message).toBe('Username already in use');
      }
    });

    it('Should throw ConflictError for conflicting email', async () => {
      existingUser = await localRepository.user.save(newUser);
      try {
        await localRepository.user.save({
          ...existingUser,
          username: 'differentUsername',
        });
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictError);
        expect(error.message).toBe('Email already in use');
      }
    });

    afterAll(() => {
      localRepository.user.users = [];
    });
  });

  describe('fetchById method.', () => {
    let userToFetch: User;
    beforeAll(async () => {
      userToFetch = await localRepository.user.save(newUser);
    });

    it('Should find a user by its id.', async () => {
      expect(await localRepository.user.fetchById(userToFetch.id)).toBe(
        userToFetch,
      );
    });

    it('Should throw NotFoundError.', async () => {
      try {
        await localRepository.user.fetchById('non-existing-id');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });

    afterAll(() => {
      localRepository.user.users = [];
    });
  });

  describe('delete method.', () => {
    let userToDelete: User;
    beforeEach(async () => {
      userToDelete = await localRepository.user.save(newUser);
    });

    it('Should delete a user successfully', async () => {
      await localRepository.user.delete(userToDelete.id);
      await expect(
        localRepository.user.fetchById(userToDelete.id),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
