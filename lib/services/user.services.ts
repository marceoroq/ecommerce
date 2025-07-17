import "server-only";

import { User as PrismaModel, Prisma } from "@/lib/generated/prisma";
import { UserRepository } from "@/lib/data/user.repository";
import { verifySession } from "@/lib/auth/verify-session";
import { auth } from "@/lib/auth";

export const UserService = {
  getAuthenticatedUserId: async (): Promise<string | undefined> => {
    const session = await auth();
    return session?.user?.id;
  },

  getUserById: async (id: string): Promise<PrismaModel | null> => {
    return await UserRepository.findById(id);
  },

  getUserByEmail: async (email: string): Promise<PrismaModel | null> => {
    return await UserRepository.findByEmail(email);
  },

  createUser: async (data: Prisma.UserCreateInput): Promise<PrismaModel> => {
    return await UserRepository.create(data);
  },

  updateUser: async (data: Prisma.UserUpdateInput): Promise<void> => {
    const { userId } = await verifySession();
    await UserRepository.update(userId, data);
  },
};
