import { Credential } from '../../src/entities/credential';
import { User } from '../../src/entities/user';
import { Vault } from '../../src/entities/vault';
import { localRepository } from '../repositories/inMemory';

describe('Credential Entity', () => {
  const user = new User('saveMethod', 'saveMethod@test.com', 'JestPass123!');
  const vault = new Vault('Test Vault', user.id);
  const plainPassword = 'CredPass123!';

  beforeAll(async () => {
    await localRepository.user.save(user);
    await localRepository.vault.save(vault);
  });

  describe('constructor', () => {
    it('Should create a credential successfully.', () => {
      const newCredential = new Credential(
        'Test Credential',
        'test@test.com',
        plainPassword,
        vault.id,
        user.secret,
      );
      if (newCredential.password === plainPassword)
        fail('Credential created with plain password');
      expect(newCredential).toBeInstanceOf(Credential);
    });
  });
});
