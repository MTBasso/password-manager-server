import { Router } from 'express';
import { CreateVaultController } from '../../use-cases/vault/create.controller';
import { ListVaultsController } from '../../use-cases/vault/list.controller';

export const vaultRouter = Router();

vaultRouter.post('/register', new CreateVaultController().handle);
vaultRouter.get('/list/:userId', new ListVaultsController().handle);
