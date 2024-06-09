import { Credential } from '../../../src/entities/credential';
import { User } from '../../../src/entities/user';
import { Vault } from '../../../src/entities/vault';
import { ConflictError, NotFoundError } from '../../../src/errors/Error';
import { localRepository } from '../inMemory';

describe('Credential Repository', () => {
  describe('save method.', () => {
    const validUserData = {
      username: 'saveMethod',
      email: 'saveMethod@test.com',
      password: 'JestPass123!',
    };
    const validCredentialData = {
      name: 'Test Credential',
      login: 'test@test.com',
      password: 'CredPass123!',
    };
    let createdUser: User;
    let createdVault: Vault;
    let conflictingCredential: Credential;

    beforeEach(async () => {
      createdUser = await localRepository.user.save(
        new User(
          validUserData.username,
          validUserData.email,
          validUserData.password,
        ),
      );
      createdVault = await localRepository.vault.save(
        new Vault('Test Vault', createdUser.id),
      );
      conflictingCredential = await localRepository.credential.save(
        new Credential(
          validCredentialData.name,
          validCredentialData.login,
          validCredentialData.password,
          createdVault.id,
          createdUser.secret,
        ),
      );
    });

    it('Should save a credential with encrypted password', async () => {
      const newCredential = await localRepository.credential.save(
        new Credential(
          'Unique Name',
          validCredentialData.login,
          validCredentialData.password,
          createdVault.id,
          createdUser.secret,
        ),
      );
      expect(newCredential).toBeInstanceOf(Credential);
      expect(newCredential.password).not.toBe(validCredentialData.password);
    });

    it('Should throw NotFoundError for non existent vault', async () => {
      const invalidCredential = new Credential(
        'Unique Name',
        validCredentialData.login,
        validCredentialData.password,
        'InvalidId',
        createdUser.secret,
      );
      await expect(
        localRepository.credential.save(invalidCredential),
      ).rejects.toThrow(NotFoundError);
    });

    it('Should throw ConflictError for conflicting name', async () => {
      await expect(
        localRepository.credential.save(
          new Credential(
            conflictingCredential.name,
            conflictingCredential.login,
            conflictingCredential.password,
            conflictingCredential.vaultId,
            createdUser.secret,
          ),
        ),
      ).rejects.toThrow(ConflictError);
    });

    afterEach(() => {
      localRepository.user.users = [];
      localRepository.vault.vaults = [];
      localRepository.credential.credentials = [];
    });
  });
});
