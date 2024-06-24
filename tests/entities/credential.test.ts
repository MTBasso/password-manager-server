import { Credential } from '../../src/entities/credential';
import { User } from '../../src/entities/user';
import { Vault } from '../../src/entities/vault';
import { localRepository } from '../repositories/inMemory';

describe('Credential Entity', () => {
  const user = new User('saveMethod', 'saveMethod@test.com', 'JestPass123!');
  const vault = new Vault('Test Vault', 'green', user.id);
  const plainPassword = 'CredPass123!';

  beforeAll(async () => {
    await localRepository.user.save(user);
    await localRepository.vault.save(vault);
  });

  describe('constructor', () => {
    it('Should create a credential successfully.', () => {
      expect(
        new Credential(
          'Test Credential 2',
          'www.test.com',
          'test@test.com',
          plainPassword,
          vault.id,
        ),
      ).toBeInstanceOf(Credential);
    });
  });
});
