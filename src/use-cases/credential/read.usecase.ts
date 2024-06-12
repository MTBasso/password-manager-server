import { NotFoundError } from '../../errors/Error';
import { prismaRepository } from '../../repositories/prisma';

export class ReadCredentialUseCase {
  async execute(id: string) {
    const fetchedCredential =
      await prismaRepository.credential.readCredential(id);
    if (!fetchedCredential) throw new NotFoundError('Credential not found');
    return fetchedCredential;
  }
}
