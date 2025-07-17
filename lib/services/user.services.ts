import "server-only";

import { User as PrismaModel, Prisma } from "@/lib/generated/prisma";
import { verifySession } from "@/lib/auth/verify-session";
import { UserRepository } from "../data/user.repository";

export const UserService = {
  getUserById: async (id: string): Promise<PrismaModel | null> => {
    return await UserRepository.findByEmail(id);
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
