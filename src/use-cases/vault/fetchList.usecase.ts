import { Vault } from '../../entities/vault';
import { InternalServerError, isCustomError } from '../../errors/Error';

export class FetchVaultListByIdUseCase {
  async execute(userId: string) {
    try {
      return await Vault.getUserVaults(userId);
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
