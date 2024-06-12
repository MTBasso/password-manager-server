import { User } from '../../../src/entities/user';
import { Vault } from '../../../src/entities/vault';
import { ConflictError, NotFoundError } from '../../../src/errors/Error';
import { localRepository } from '../inMemory';

describe('Vault Repository', () => {
  let user = new User('saveMethod', 'saveMethod@test.com', 'JestPass123!');
  let existingVault: Vault;
  let newVault: Vault;

  beforeAll(async () => {
    user = await localRepository.user.save(user);
    existingVault = await localRepository.vault.save(
      new Vault('existingVault', user.id),
    );
    newVault = new Vault('New Vault', user.id);
  });

  afterEach(() => {
    localRepository.vault.vaults = [];
  });

  describe('save method.', () => {
    it('Should save a Vault', async () => {
      expect(await localRepository.vault.save(newVault)).toBeInstanceOf(Vault);
    });

    it('Should throw not found error for non existent user', async () => {
      await expect(
        localRepository.vault.save({ ...newVault, userId: 'non-existing-id' }),
      ).rejects.toThrow(NotFoundError);
    });

    it('Should throw conflict error for conflicting name', async () => {
      await localRepository.vault.save(newVault);
      await expect(localRepository.vault.save(newVault)).rejects.toThrow(
        ConflictError,
      );
    });
  });

  describe('fetchById method.', () => {
    let vaultToFetch: Vault;
    beforeAll(async () => {
      vaultToFetch = await localRepository.vault.save(newVault);
    });

    it('Should find a vault by its id.', async () => {
      const fetchedVault = await localRepository.vault.fetchById(
        vaultToFetch.id,
      );
      expect(fetchedVault).toBe(vaultToFetch);
    });

    it('Should throw NotFoundError.', async () => {
      await expect(
        localRepository.vault.fetchById('non-existing-id'),
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe('update method.', () => {
    let vaultToUpdate: Vault;

    beforeEach(async () => {
      vaultToUpdate = await localRepository.vault.save(newVault);
    });

    it("Should update a vault's name", async () => {
      const updatedName = 'Updated Vault';
      const updatedVault = await localRepository.vault.update(
        vaultToUpdate.id,
        updatedName,
      );
      expect(updatedVault.name).toBe(updatedName);
    });

    it('Should throw NotFoundError for invalid id', async () => {
      await expect(
        localRepository.vault.update('invalid-id', 'New Name'),
      ).rejects.toThrow(NotFoundError);
    });

    it('Should throw ConflictError for conflicting name', async () => {
      const anotherVault = await localRepository.vault.save(
        new Vault('Another Vault', user.id),
      );
      await expect(
        localRepository.vault.update(vaultToUpdate.id, anotherVault.name),
      ).rejects.toThrow(ConflictError);
    });
  });

  describe('delete method.', () => {
    let vaultToDelete: Vault;

    beforeEach(async () => {
      vaultToDelete = await localRepository.vault.save(newVault);
    });

    it('Should delete a vault successfully', async () => {
      await localRepository.vault.delete(vaultToDelete.id);
      await expect(
        localRepository.vault.fetchById(vaultToDelete.id),
      ).rejects.toThrow(NotFoundError);
    });

    it('Should throw NotFoundError for invalid id', async () => {
      await expect(localRepository.vault.delete('invalid-id')).rejects.toThrow(
        NotFoundError,
      );
    });
  });
});
