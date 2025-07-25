import "server-only";
import prisma from "@/lib/prisma";
import { Review as PrismaModel, Prisma } from "@/lib/generated/prisma";

export const ReviewRepository = {
  findAll: async (options?: Prisma.ReviewFindManyArgs): Promise<PrismaModel[]> =>
    await prisma?.review.findMany(options),

  findById: async (id: string): Promise<PrismaModel | null> =>
    await prisma.review.findUnique({ where: { id } }),

  findByUserAndProduct: async (userId: string, productId: string): Promise<PrismaModel | null> =>
    await prisma.review.findFirst({
      where: {
        userId,
        productId,
      },
    }),

  count: async (options?: Prisma.ReviewCountArgs): Promise<number> =>
    await prisma?.review.count(options),

  create: async (data: Prisma.ReviewCreateInput): Promise<PrismaModel> =>
    await prisma.review.create({ data }),

  createMany: async (data: Prisma.ReviewCreateManyInput[]): Promise<Prisma.BatchPayload> =>
    await prisma.review.createMany({ data }),

  update: async (id: string, data: Prisma.ReviewUpdateInput): Promise<PrismaModel> =>
    await prisma.review.update({
      where: { id },
      data,
    }),

  delete: async (id: string): Promise<PrismaModel> => await prisma.review.delete({ where: { id } }),

  deleteMany: async (options?: Prisma.ReviewDeleteManyArgs): Promise<Prisma.BatchPayload> =>
    await prisma.review.deleteMany(options),
};
