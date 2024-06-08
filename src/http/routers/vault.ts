import { Router } from 'express';
import { CreateVaultController } from '../../use-cases/vault/create.controller';
import { FetchVaultListByIdController } from '../../use-cases/vault/fetchList.controller';

export const vaultRouter = Router();

vaultRouter.post('/register', (req, res) =>
  new CreateVaultController().handle(req, res),
);
vaultRouter.get('/fetch-vault-list/:userId', (req, res) =>
  new FetchVaultListByIdController().handle(req, res),
);
