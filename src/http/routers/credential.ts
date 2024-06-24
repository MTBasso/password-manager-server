import { Router } from 'express';
import { CreateCredentialController } from '../../use-cases/credential/create.controller';
import { DeleteCredentialController } from '../../use-cases/credential/delete.controller';
import { ListCredentialsController } from '../../use-cases/credential/list.controller';
import { ReadCredentialController } from '../../use-cases/credential/read.controller';
import { UpdateCredentialController } from '../../use-cases/credential/update.controller';
import { authenticateToken, verifyUserId } from '../middlewares/auth';

export const credentialRouter = Router();

credentialRouter.use(authenticateToken);

credentialRouter.post(
  '/register',
  verifyUserId,
  new CreateCredentialController().handle,
);
credentialRouter.get(
  '/read/:credentialId',
  verifyUserId,
  new ReadCredentialController().handle,
);
credentialRouter.get(
  '/list/:vaultId',
  verifyUserId,
  new ListCredentialsController().handle,
);
credentialRouter.patch(
  '/update/:credentialId',
  verifyUserId,
  new UpdateCredentialController().handle,
);
credentialRouter.delete(
  '/delete/:credentialId',
  verifyUserId,
  new DeleteCredentialController().handle,
);
