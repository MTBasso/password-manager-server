import { Router } from 'express';
import { CreateVaultController } from '../../use-cases/vault/create.controller';
import { DeleteVaultController } from '../../use-cases/vault/delete.controller';
import { ListVaultsController } from '../../use-cases/vault/list.controller';
import { UpdateVaultController } from '../../use-cases/vault/update.controller';

export const vaultRouter = Router();

vaultRouter.post('/register', new CreateVaultController().handle);
vaultRouter.get('/list/:userId', new ListVaultsController().handle);
vaultRouter.patch('/update/:vaultId', new UpdateVaultController().handle);
vaultRouter.delete('/delete/:vaultId', new DeleteVaultController().handle);
