import "server-only";
import { ReviewRepository } from "@/lib/data/review.repository";
import type { Prisma, Review as PrismaReview } from "@/lib/generated/prisma";

export const ReviewService = {
  getAll: async <T extends Prisma.ReviewFindManyArgs>(options?: T) => {
    return await ReviewRepository.findAll(options);
  },

  getById: async (id: string) => {
    return await ReviewRepository.findById(id);
  },

  getAllByProductId: async (productId: string) => {
    return await ReviewRepository.findAll({
      where: { productId },
      include: { user: { select: { name: true, image: true } } },
      omit: { productId: true },
    });
  },

  count: async (options?: Prisma.ReviewCountArgs) => {
    return await ReviewRepository.count(options);
  },

  create: async (data: Prisma.ReviewCreateInput) => {
    return await ReviewRepository.create(data);
  },

  update: async (id: string, data: Prisma.ReviewUpdateInput) => {
    return await ReviewRepository.update(id, data);
  },

  delete: async (id: string) => {
    return await ReviewRepository.delete(id);
  },

  getByUserAndProduct: async (userId: string, productId: string): Promise<PrismaReview | null> => {
    return await ReviewRepository.findByUserAndProduct(userId, productId);
  },
};
