import { User } from '../../../src/entities/user';
import { Vault } from '../../../src/entities/vault';
import { ConflictError, NotFoundError } from '../../../src/errors/Error';
import { localRepository } from '../inMemory';

describe('Vault Repository', () => {
  describe('save method.', () => {
    const validUserData = {
      username: 'saveMethod',
      email: 'saveMethod@test.com',
      password: 'JestPass123!',
    };
    const { username, email, password } = validUserData;
    let createdUser: User;
    let existingVault: Vault;

    beforeAll(async () => {
      createdUser = await localRepository.user.save(
        new User(username, email, password),
      );
    });

    it('Should save a Vault', async () => {
      expect(
        await localRepository.vault.save(
          new Vault('Test Vault', createdUser.id),
        ),
      );
    });

    it('Should throw not found error for non existent user', async () => {
      const invalidVault = new Vault('Test Vault', 'non-existing-id');
      await expect(localRepository.vault.save(invalidVault)).rejects.toThrow(
        NotFoundError,
      );
    });

    it('Should throw conflict error for conflicting name', async () => {
      existingVault = await localRepository.vault.save(
        new Vault('existingVault', createdUser.id),
      );
      await expect(
        localRepository.vault.save(
          new Vault(existingVault.name, createdUser.id),
        ),
      ).rejects.toThrow(ConflictError);
    });

    afterEach(() => {
      localRepository.vault.vaults = [];
    });
  });
});
