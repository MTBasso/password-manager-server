import { User } from '../../src/entities/user';
import { Vault } from '../../src/entities/vault';
import { localRepository } from '../repositories/inMemory';

describe('Vault Entity', () => {
  const user = new User('Jest', 'jest@test.com', 'JestPass123!');

  beforeAll(async () => {
    await localRepository.user.save(user);
  });

  describe('constructor', () => {
    it('Should create a Vault successfully.', () => {
      expect(new Vault('Vault Name', 'green', user.id)).toBeInstanceOf(Vault);
    });
  });
});
