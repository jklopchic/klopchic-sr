import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class UserService {
  private static instance: UserService;

  private constructor() {}

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async getOrCreateUser(auth0Id: string, email: string, name?: string) {
    return prisma.user.upsert({
      where: { auth0Id },
      update: {},
      create: {
        email,
        name,
        auth0Id
      }
    });
  }
} 