import "server-only";

import prisma from "@/lib/prisma";
import { Cart as PrismaModel, Prisma } from "@/lib/generated/prisma";

export const CartRepository = {
  findAll: async (options?: Prisma.CartFindManyArgs): Promise<PrismaModel[]> =>
    await prisma?.cart.findMany(options),

  findById: async (id: string): Promise<PrismaModel | null> =>
    await prisma.cart.findUnique({ where: { id } }),

  findByUserId: async (userId: string): Promise<PrismaModel | null> =>
    await prisma.cart.findUnique({ where: { userId } }),

  findBySessionCartId: async (
    sessionCartId: string
  ): Promise<PrismaModel | null> =>
    await prisma.cart.findFirst({ where: { sessionCartId } }),

  create: async (data: Prisma.CartCreateInput): Promise<PrismaModel> =>
    await prisma.cart.create({ data }),

  createMany: async (
    data: Prisma.CartCreateManyInput[]
  ): Promise<Prisma.BatchPayload> => await prisma.cart.createMany({ data }),

  update: async (
    id: string,
    data: Prisma.CartUpdateInput
  ): Promise<PrismaModel> =>
    await prisma.cart.update({
      where: { id },
      data,
    }),

  delete: async (id: string): Promise<PrismaModel> =>
    await prisma.cart.delete({ where: { id } }),

  deleteMany: async (
    options?: Prisma.CartDeleteManyArgs
  ): Promise<Prisma.BatchPayload> => await prisma.cart.deleteMany(options),
};
