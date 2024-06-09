import { User } from '../../../src/entities/user';
import { Vault } from '../../../src/entities/vault';
import { ConflictError, NotFoundError } from '../../../src/errors/Error';
import { localRepository } from '../inMemory';

describe('Vault Repository', () => {
  const validUserData = {
    username: 'saveMethod',
    email: 'saveMethod@test.com',
    password: 'JestPass123!',
  };
  const { username, email, password } = validUserData;
  const user = new User(username, email, password);
  const newVault = new Vault('existingVault', user.id);

  describe('save method.', () => {
    beforeAll(async () => {
      await localRepository.user.save(user);
    });

    it('Should save a Vault', async () => {
      expect(
        await localRepository.vault.save(new Vault('Test Vault', user.id)),
      );
    });

    it('Should throw not found error for non existent user', async () => {
      const invalidVault = new Vault('Test Vault', 'non-existing-id');
      await expect(localRepository.vault.save(invalidVault)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('Should throw conflict error for conflicting name', async () => {
      await localRepository.vault.save(newVault);
      try {
        await localRepository.vault.save(new Vault(newVault.name, user.id));
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictError);
      }
    });

    afterEach(() => {
      localRepository.vault.vaults = [];
    });
  });

  describe('fetchById method.', () => {
    let vaultToFetch: Vault;
    beforeAll(async () => {
      vaultToFetch = await localRepository.vault.save(newVault);
    });

    it('Should find a vault by its id.', async () => {
      expect(await localRepository.vault.fetchById(vaultToFetch.id)).toBe(
        vaultToFetch,
      );
    });

    it('Should throw NotFoundError.', async () => {
      try {
        await localRepository.vault.fetchById('non-existing-id');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });
  });
});
