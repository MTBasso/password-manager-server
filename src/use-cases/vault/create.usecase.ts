import { Vault, type VaultProps } from '../../entities/vault';
import { InternalServerError, isCustomError } from '../../errors/Error';

export class CreateVaultUseCase {
  async execute({ name, userId }: VaultProps) {
    try {
      return await Vault.create({
        name,
        userId,
      });
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
