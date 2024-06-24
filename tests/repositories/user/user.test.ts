import { hash } from 'bcryptjs';
import { User } from '../../../src/entities/user';
import {
  BadRequestError,
  ConflictError,
  NotFoundError,
} from '../../../src/errors/Error';
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

  beforeEach(() => {
    localRepository.user.users = [];
  });

  describe('save method.', () => {
    let existingUser: User;

    it('Should save a User', async () => {
      const savedUserResponse = await localRepository.user.save(newUser);
      expect(savedUserResponse.user).toBeInstanceOf(User);
    });

    it('Should throw ConflictError for conflicting username', async () => {
      existingUser = (await localRepository.user.save(newUser)).user;
      try {
        await localRepository.user.save({
          ...existingUser,
          email: 'different@email.com',
        });
      } catch (error) {
        if (error instanceof ConflictError) {
          expect(error.message).toBe('Username is already in use');
        } else {
          fail('Expected ConflictError');
        }
      }
    });

    it('Should throw ConflictError for conflicting email', async () => {
      existingUser = (await localRepository.user.save(newUser)).user;
      try {
        await localRepository.user.save({
          ...existingUser,
          username: 'differentUsername',
        });
      } catch (error) {
        if (error instanceof ConflictError) {
          expect(error.message).toBe('Email is already in use');
        } else {
          fail('Expected ConflictError');
        }
      }
    });

    afterAll(() => {
      localRepository.user.users = [];
    });
  });

  describe('fetchById method.', () => {
    let userToFetch: User;
    beforeEach(async () => {
      userToFetch = (await localRepository.user.save(newUser)).user;
    });

    it('Should find a user by its id.', async () => {
      const fetchedUser = await localRepository.user.fetchById(userToFetch.id);
      expect(fetchedUser).toBe(userToFetch);
    });

    it('Should throw NotFoundError.', async () => {
      await expect(
        localRepository.user.fetchById('non-existing-id'),
      ).rejects.toThrow(NotFoundError);
    });

    afterAll(() => {
      localRepository.user.users = [];
    });
  });

  describe('delete method.', () => {
    let userToDelete: User;
    beforeEach(async () => {
      userToDelete = (await localRepository.user.save(newUser)).user;
    });

    it('Should delete a user successfully', async () => {
      await localRepository.user.delete(userToDelete.id);
      await expect(
        localRepository.user.fetchById(userToDelete.id),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('update method.', () => {
    let userToUpdate: User;
    let anotherUser: User;

    beforeEach(async () => {
      userToUpdate = (await localRepository.user.save(newUser)).user;
      anotherUser = (
        await localRepository.user.save(
          new User('anotherUser', 'anotherUser@test.com', 'AnotherPass123!'),
        )
      ).user;
    });

    it('Should update user fields', async () => {
      const updatedData = {
        username: 'updatedUser',
        email: 'updatedUser@test.com',
        password: 'UpdatedPass123!',
      };
      const updatedUser = await localRepository.user.update(
        userToUpdate.id,
        updatedData,
      );
      expect(updatedUser.username).toBe(updatedData.username);
      expect(updatedUser.email).toBe(updatedData.email);
    });

    it('Should throw NotFoundError for invalid id', async () => {
      await expect(
        localRepository.user.update('invalid-id', { username: 'newUsername' }),
      ).rejects.toThrow(NotFoundError);
    });

    it('Should throw ConflictError for conflicting username', async () => {
      await expect(
        localRepository.user.update(userToUpdate.id, {
          username: anotherUser.username,
        }),
      ).rejects.toThrow(ConflictError);
    });

    it('Should throw ConflictError for conflicting email', async () => {
      await expect(
        localRepository.user.update(userToUpdate.id, {
          email: anotherUser.email,
        }),
      ).rejects.toThrow(ConflictError);
    });

    it('Should throw BadRequestError for weak password', async () => {
      await expect(
        localRepository.user.update(userToUpdate.id, { password: 'weak' }),
      ).rejects.toThrow(BadRequestError);
    });
  });
});
