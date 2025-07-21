import "server-only";

import prisma from "@/lib/prisma";
import { User as PrismaModel, Prisma } from "@/lib/generated/prisma";

export const UserRepository = {
  findAll: async (options?: Prisma.UserFindManyArgs): Promise<PrismaModel[]> =>
    await prisma?.user.findMany(options),

  findById: async (id: string): Promise<PrismaModel | null> =>
    await prisma.user.findUnique({ where: { id } }),

  findByEmail: async (email: string): Promise<PrismaModel | null> =>
    await prisma.user.findUnique({ where: { email } }),

  count: async (options?: Prisma.UserCountArgs): Promise<number> =>
    await prisma?.user.count(options),

  create: async (data: Prisma.UserCreateInput): Promise<PrismaModel> =>
    await prisma.user.create({ data }),

  createMany: async (data: Prisma.UserCreateManyInput[]): Promise<Prisma.BatchPayload> =>
    await prisma.user.createMany({ data }),

  update: async (id: string, data: Prisma.UserUpdateInput): Promise<PrismaModel> =>
    await prisma.user.update({
      where: { id },
      data,
    }),

  delete: async (id: string): Promise<PrismaModel> => await prisma.user.delete({ where: { id } }),

  deleteMany: async (options?: Prisma.UserDeleteManyArgs): Promise<Prisma.BatchPayload> =>
    await prisma.user.deleteMany(options),
};
