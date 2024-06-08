import { localRepository } from './inMemory';
import { prismaRepository } from './prisma';

export const activeRepository = prismaRepository;
