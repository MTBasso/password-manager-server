import { Vault, VaultProps } from "../../entities/vault";
import { inMemoryUserRepository } from "../../http/app";
import { VaultRepository } from "./interface";

export class InMemoryVaultRepository implements VaultRepository {
  vaults: Vault[] = [];
  userRepository = inMemoryUserRepository;

  async create({ name, userId }: VaultProps): Promise<Vault> {
    const user = await this.userRepository.fetchById(userId);
    const createdVault = new Vault({name, user});
    this.vaults.push(createdVault);
    return createdVault;
  }
}