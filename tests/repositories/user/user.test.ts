import { User } from '../../../src/entities/user';
import { NotFoundError } from '../../../src/errors/Error';
import { localRepository } from '../inMemory';

describe('User Repository', () => {
  describe('save method.', () => {
    const validUserData = {
      username: 'saveMethod',
      email: 'saveMethod@test.com',
      password: 'JestPass123!',
    };
    const { username, email, password } = validUserData;
    const createdUser = new User(username, email, password);

    beforeEach(() => {
      localRepository.user.users = [];
    });

    it('Should save a User', async () => {
      expect(await localRepository.user.save(createdUser)).toBeInstanceOf(User);
    });
  });

  describe('fetchById method.', () => {
    const validUserData = {
      username: 'fetchById',
      email: 'fetchById@test.com',
      password: 'JestPass123!',
    };
    const { username, email, password } = validUserData;
    const createdUser = new User(username, email, password);

    beforeAll(async () => {
      await localRepository.user.save(createdUser);
    });

    it('Should find a user by its id.', async () => {
      expect(
        await localRepository.user.fetchById(createdUser.id),
      ).toBeInstanceOf(User);
    });

    afterAll(() => {
      localRepository.user.users = [];
    });
  });

  describe('delete method.', () => {
    const validUserData = {
      username: 'delete',
      email: 'delete@test.com',
      password: 'JestPass123!',
    };
    const { username, email, password } = validUserData;
    let createdUser: User;

    beforeEach(async () => {
      createdUser = new User(username, email, password);
      await localRepository.user.save(createdUser);
    });

    it('Should delete a user successfully', async () => {
      await localRepository.user.delete(createdUser.id);
      await expect(
        localRepository.user.fetchById(createdUser.id),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
