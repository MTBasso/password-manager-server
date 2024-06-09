import { Router } from 'express';
import { CreateCredentialController } from '../../use-cases/credential/create.controller';
import { ReadCredentialController } from '../../use-cases/credential/read.controller';

export const credentialRouter = Router();

credentialRouter.post('/register', new CreateCredentialController().handle);
credentialRouter.get(
  '/read/:credentialId',
  new ReadCredentialController().handle,
);

// credentialRouter.get('/list/:vaultId', new ListCredentialsController().handle);
