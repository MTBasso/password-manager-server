import { Router } from "express";
import { CreateVaultController } from "../../use-cases/vault/create.controller";

export const vaultRouter = Router();

vaultRouter.post('/register', new CreateVaultController().handle);