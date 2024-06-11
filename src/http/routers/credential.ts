import { Router } from 'express';
import { CreateCredentialController } from '../../use-cases/credential/create.controller';
import { DeleteCredentialController } from '../../use-cases/credential/delete.controller';
import { ListCredentialsController } from '../../use-cases/credential/list.controller';
import { ReadCredentialController } from '../../use-cases/credential/read.controller';
import { UpdateCredentialController } from '../../use-cases/credential/update.controller';

export const credentialRouter = Router();

credentialRouter.post('/register', new CreateCredentialController().handle);
credentialRouter.get(
  '/read/:credentialId',
  new ReadCredentialController().handle,
);
credentialRouter.get('/list/:vaultId', new ListCredentialsController().handle);
credentialRouter.patch(
  '/update/:credentialId',
  new UpdateCredentialController().handle,
);
credentialRouter.delete(
  '/delete/:credentialId',
  new DeleteCredentialController().handle,
);
