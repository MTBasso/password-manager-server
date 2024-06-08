import { User, type UserProps } from '../../src/entities/user';
import { Vault, type VaultProps } from '../../src/entities/vault';

describe('Vault Entity', () => {
  const validUserData: UserProps = {
    username: 'Jest',
    email: 'jest@test.com',
    password: 'JestPass123!',
  };
  let validVaultData: VaultProps;

  beforeEach(async () => {
    const createdUser = await User.create(validUserData);
    validVaultData = {
      name: 'Test Vault',
      userId: createdUser.id,
    };
  });

  describe('constructor', () => {
    it('Should create a Vault successfully.', async () => {
      expect(await Vault.create(validVaultData)).toBeInstanceOf(Vault);
    });
  });
});
