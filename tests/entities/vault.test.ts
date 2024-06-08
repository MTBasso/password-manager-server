import { User } from '../../src/entities/user';
import { Vault } from '../../src/entities/vault';
import { localRepository } from '../repositories/inMemory';

describe('Vault Entity', () => {
  const validUserData = {
    username: 'Jest',
    email: 'jest@test.com',
    password: 'JestPass123!',
  };
  let createdUser: User;

  beforeAll(async () => {
    const { username, email, password } = validUserData;
    createdUser = await localRepository.user.save(
      new User(username, email, password),
    );
  });

  describe('constructor', () => {
    it('Should create a Vault successfully.', () => {
      expect(new Vault('Vault Name', createdUser.id)).toBeInstanceOf(Vault);
    });
  });
});
