import { Credential } from '../../../src/entities/credential';
import { User } from '../../../src/entities/user';
import { Vault } from '../../../src/entities/vault';
import { ConflictError, NotFoundError } from '../../../src/errors/Error';
import { localRepository } from '../inMemory';

describe('Credential Repository', () => {
  const user = new User('saveMethod', 'saveMethod@test.com', 'JestPass123!');
  const vault = new Vault('Test Vault', user.id);
  const plainPassword = 'CredPass123!';
  const newCredential = new Credential(
    'Test Credential',
    'test@test.com',
    plainPassword,
    vault.id,
    user.secret,
  );

  beforeAll(async () => {
    await localRepository.user.save(user);
    await localRepository.vault.save(vault);
  });

  afterEach(() => {
    localRepository.credential.credentials = [];
  });

  describe('save method.', () => {
    it('Should save a credential with encrypted password', async () => {
      const savedCredential =
        await localRepository.credential.save(newCredential);
      expect(savedCredential).toBeInstanceOf(Credential);
      expect(savedCredential.password !== plainPassword).toBe(true);
    });

    it('Should throw NotFoundError for non existent vault', async () => {
      await expect(
        localRepository.credential.save({
          ...newCredential,
          vaultId: 'InvalidId',
        }),
      ).rejects.toThrow(NotFoundError);
    });

    it('Should throw ConflictError for conflicting name', async () => {
      await localRepository.credential.save(newCredential);
      try {
        await localRepository.credential.save(newCredential);
      } catch (error) {
        expect(error).toBeInstanceOf(ConflictError);
      }
    });
  });

  describe('fetchById method', () => {
    let credentialToFetch: Credential;
    beforeAll(async () => {
      credentialToFetch = await localRepository.credential.save(newCredential);
    });

    it('Should fetch a Credential by its id', async () => {
      const fetchedCredential = await localRepository.credential.fetchById(
        newCredential.id,
      );
      expect(fetchedCredential).toBe(credentialToFetch);
    });

    it('Should throw NotFoundError', async () => {
      try {
        await localRepository.credential.fetchById('InvalidId');
      } catch (error) {
        expect(error).toBeInstanceOf(NotFoundError);
      }
    });
  });
});
