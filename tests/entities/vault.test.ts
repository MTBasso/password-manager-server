import { User, type UserProps } from '../../src/entities/user';
import { Vault, type VaultConstructorProps } from '../../src/entities/vault';

describe('Vault Entity', () => {
  const validUserData: UserProps = {
    username: 'Jest',
    email: 'jest@test.com',
    password: 'JestPass123!',
  };
  let validVaultData: VaultConstructorProps;

  beforeEach(() => {
    const createdUser = User.create(validUserData);
    validVaultData = {
      name: 'Test Vault',
      user: createdUser,
    };
  });

  describe('constructor', () => {
    it('Should create a Vault successfully.', () => {
      expect(new Vault(validVaultData)).toBeInstanceOf(Vault);
    });
  });
});
