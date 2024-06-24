import { Credential } from '../../../src/entities/credential';
import { User } from '../../../src/entities/user';
import { Vault } from '../../../src/entities/vault';
import { ConflictError, NotFoundError } from '../../../src/errors/Error';
import { localRepository } from '../inMemory';

describe('Credential Repository', () => {
  let user = new User('saveMethod', 'saveMethod@test.com', 'JestPass123!');
  let vault = new Vault('Test Vault', 'green', user.id);
  const plainPassword = 'CredPass123!';
  let newCredential: Credential;

  beforeAll(async () => {
    user = (await localRepository.user.save(user)).user;
    vault = await localRepository.vault.save(vault);
    newCredential = new Credential(
      'Test Credential',
      'www.test.com',
      'test@test.com',
      plainPassword,
      vault.id,
    );
  });

  afterEach(() => {
    localRepository.credential.credentials = [];
  });

  describe('save method.', () => {
    it('Should save a credential with encrypted password', async () => {
      const savedCredential =
        await localRepository.credential.save(newCredential);
      expect(plainPassword).toBe(
        localRepository.credential.decryptPassword(
          savedCredential.password,
          user.secret,
        ),
      );
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
      await expect(
        localRepository.credential.save(newCredential),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('fetchById method', () => {
    let credentialToFetch: Credential;
    beforeAll(async () => {
      credentialToFetch = await localRepository.credential.save(newCredential);
    });

    it('Should fetch a Credential by its id', async () => {
      const fetchedCredential = await localRepository.credential.fetchById(
        credentialToFetch.id,
      );
      expect(fetchedCredential).toBe(credentialToFetch);
    });

    it('Should throw NotFoundError', async () => {
      await expect(
        localRepository.credential.fetchById('invalidId'),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('readCredential method', () => {
    let credentialToRead: Credential;
    beforeAll(async () => {
      credentialToRead = await localRepository.credential.save(newCredential);
    });

    it('Should read a credential and decrypt its password', async () => {
      const readCredential = await localRepository.credential.readCredential(
        credentialToRead.id,
      );
      expect(readCredential).toBeInstanceOf(Credential);
    });

    it('Should throw NotFoundError if credential is not found', async () => {
      await expect(
        localRepository.credential.readCredential('InvalidId'),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('listByVaultId method', () => {
    let vaultId: string;
    beforeAll(async () => {
      vaultId = vault.id;
      await localRepository.credential.save(newCredential);
    });

    it('Should list all credentials for a given vault', async () => {
      const credentials =
        await localRepository.credential.listByVaultId(vaultId);
      expect(credentials).toHaveLength(1);
      expect(credentials[0].id).toBe(newCredential.id);
    });

    it('Should throw NotFoundError if vault does not exist', async () => {
      await expect(
        localRepository.credential.listByVaultId('InvalidId'),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('update method', () => {
    let credentialToUpdate: Credential;
    let anotherCredential: Credential;

    beforeEach(async () => {
      localRepository.credential.credentials = [];
      credentialToUpdate = await localRepository.credential.save(newCredential);
      anotherCredential = await localRepository.credential.save(
        new Credential(
          'Another Credential',
          'www.anotherTest.com',
          'another@test.com',
          'AnotherPass123!',
          vault.id,
        ),
      );
    });

    it('Should update credential fields', async () => {
      const updatedData = {
        name: 'Updated Credential',
        website: 'www.updatedTest.com',
        login: 'updated@test.com',
      };
      const updatedCredential = await localRepository.credential.update(
        credentialToUpdate.id,
        updatedData,
      );
      expect(updatedCredential.name).toBe(updatedData.name);
      expect(updatedCredential.website).toBe(updatedData.website);
      expect(updatedCredential.login).toBe(updatedData.login);
    });

    it('Should throw NotFoundError for invalid id', async () => {
      await expect(
        localRepository.credential.update('InvalidId', { name: 'New Name' }),
      ).rejects.toThrow(NotFoundError);
    });

    it('Should throw ConflictError for conflicting name', async () => {
      await expect(
        localRepository.credential.update(credentialToUpdate.id, {
          name: anotherCredential.name,
        }),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('delete method', () => {
    let credentialToDelete: Credential;
    beforeAll(async () => {
      credentialToDelete = await localRepository.credential.save(newCredential);
    });

    it('Should delete a credential by its id', async () => {
      await localRepository.credential.delete(credentialToDelete.id);
      await expect(
        localRepository.credential.fetchById(credentialToDelete.id),
      ).rejects.toThrow(NotFoundError);
    });

    it('Should throw NotFoundError for invalid id', async () => {
      await expect(
        localRepository.credential.delete('InvalidId'),
      ).rejects.toThrow(NotFoundError);
    });
  });
});
