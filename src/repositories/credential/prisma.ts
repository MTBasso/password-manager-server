import { prisma } from '../../../prisma';
import type { Credential } from '../../entities/credential';
import {
  ConflictError,
  InternalServerError,
  NotFoundError,
  isCustomError,
} from '../../errors/Error';
import type { CredentialRepository } from './interface';

export class PrismaCredentialRepository implements CredentialRepository {
  async save(credential: Credential): Promise<Credential> {
    try {
      await this.verifyNonConflictingName(credential.name);
      return await prisma.credential.create({ data: credential });
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  async fetchById(id: string): Promise<Credential> {
    try {
      const fetchedCredential = await prisma.credential.findUnique({
        where: { id },
      });
      if (!fetchedCredential) throw new NotFoundError('Credential not found');
      return fetchedCredential;
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }

  private async verifyNonConflictingName(name: string) {
    try {
      if (
        await prisma.credential.findFirst({
          where: { name: name },
        })
      )
        throw new ConflictError(
          'This vault already has a credential with this name',
        );
    } catch (error) {
      if (isCustomError(error)) throw error;
      throw new InternalServerError();
    }
  }
}
