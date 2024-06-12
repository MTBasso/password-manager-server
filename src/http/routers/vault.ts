import { Router } from 'express';
import { CreateVaultController } from '../../use-cases/vault/create.controller';
import { DeleteVaultController } from '../../use-cases/vault/delete.controller';
import { ListVaultsController } from '../../use-cases/vault/list.controller';
import { UpdateVaultController } from '../../use-cases/vault/update.controller';
import { authenticateToken, verifyUserId } from '../middlewares/auth';

export const vaultRouter = Router();

vaultRouter.use(authenticateToken);

vaultRouter.post('/register', verifyUserId, new CreateVaultController().handle);
vaultRouter.get(
  '/list/:userId',
  verifyUserId,
  new ListVaultsController().handle,
);
vaultRouter.patch(
  '/update/:vaultId',
  verifyUserId,
  new UpdateVaultController().handle,
);
vaultRouter.delete(
  '/delete/:vaultId',
  verifyUserId,
  new DeleteVaultController().handle,
);
