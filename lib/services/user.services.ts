import "server-only";

import { User as PrismaModel, Prisma } from "@/lib/generated/prisma";
import { UserRepository } from "@/lib/data/user.repository";
import { verifySession } from "@/lib/auth/verify-session";
import { auth } from "@/lib/auth";

export const UserService = {
  getAllUsers: async (searchTerm?: string): Promise<PrismaModel[]> => {
    return await UserRepository.findAll({
      where: { name: { contains: searchTerm, mode: "insensitive" } },
      orderBy: { name: "asc" },
    });
  },

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

  updateUser: async (userId: string, data: Prisma.UserUpdateInput): Promise<void> => {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    await UserRepository.update(userId, data);
  },

  updateAuthenticatedUser: async (data: Prisma.UserUpdateInput): Promise<void> => {
    const { userId } = await verifySession();
    await UserRepository.update(userId, data);
  },

  deleteUser: async (userId: string): Promise<void> => {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    await UserRepository.delete(userId);
  },
};
