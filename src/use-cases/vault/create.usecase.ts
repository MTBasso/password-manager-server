import { VaultProps } from "../../entities/vault";
import { InternalServerError, isCustomError } from "../../errors/Error";
import { VaultRepository } from "../../repositories/vault/interface";

export class CreateVaultUseCase {
  constructor(private vaultRepository: VaultRepository) {}

  async execute({name, userId}: VaultProps) {
    try {
      return await this.vaultRepository.create({
        name, 
        userId
      });
    } catch (error) {
      if(isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}