import "server-only";

import prisma from "@/lib/prisma";
import { Product as PrismaModel, Prisma } from "@/lib/generated/prisma";

export const ProductRepository = {
  findAll: async (
    options?: Prisma.ProductFindManyArgs
  ): Promise<PrismaModel[]> => await prisma?.product.findMany(options),

  findById: async (id: string): Promise<PrismaModel | null> =>
    await prisma.product.findUnique({ where: { id } }),

  findBySlug: async (slug: string): Promise<PrismaModel | null> =>
    await prisma.product.findUnique({ where: { slug } }),

  create: async (data: Prisma.ProductCreateInput): Promise<PrismaModel> =>
    await prisma.product.create({ data }),

  createMany: async (
    data: Prisma.ProductCreateManyInput[]
  ): Promise<Prisma.BatchPayload> => await prisma.product.createMany({ data }),

  update: async (
    id: string,
    data: Prisma.ProductUpdateInput
  ): Promise<PrismaModel> =>
    await prisma.product.update({
      where: { id },
      data,
    }),

  delete: async (id: string): Promise<PrismaModel> =>
    await prisma.product.delete({ where: { id } }),

  deleteMany: async (
    options?: Prisma.ProductDeleteManyArgs
  ): Promise<Prisma.BatchPayload> => await prisma.product.deleteMany(options),
};
