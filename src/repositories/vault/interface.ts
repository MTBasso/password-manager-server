import { Vault, VaultProps } from "../../entities/vault";
import { UserRepository } from "../user/interface";

export interface VaultRepository {
  vaults?: Vault[];
  userRepository: UserRepository;
  create({ name, userId }): Promise<Vault>;
}