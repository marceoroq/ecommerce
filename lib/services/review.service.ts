import "server-only";

import prisma from "@/lib/prisma";
import { ReviewRepository } from "@/lib/data/review.repository";
import type { Prisma, Review as PrismaReview } from "@/lib/generated/prisma";
import { CreateReviewForm } from "@/types";
import { ProductService } from "./product.services";

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

  create: async (userId: string, productId: string, reviewData: CreateReviewForm) => {
    return await prisma.$transaction(async (tx) => {
      // Obtain current rating and numReviews
      const currentRatingAndNumRevies = await ProductService.getRatingAndNumReviewsById(productId);

      if (!currentRatingAndNumRevies) {
        throw new Error("Product not found");
      }

      const { rating, numReviews } = currentRatingAndNumRevies;

      const review = await tx.review.create({
        data: {
          ...reviewData,
          user: { connect: { id: userId } },
          product: { connect: { id: productId } },
        },
      });

      // Calculate new rating
      const newRating = (rating * numReviews + reviewData.rating) / (numReviews + 1);

      await tx.product.update({
        where: { id: productId },
        data: {
          rating: newRating,
          numReviews: {
            increment: 1,
          },
        },
      });

      return review;
    });
  },

  update: async (id: string, data: Prisma.ReviewUpdateInput) => {
    return await ReviewRepository.update(id, data);
  },

  delete: async (id: string) => {
    return await prisma.$transaction(async (tx) => {
      const review = await tx.review.findUnique({
        where: { id },
      });

      if (!review) {
        throw new Error("Review not found");
      }

      const currentRatingAndNumRevies = await ProductService.getRatingAndNumReviewsById(
        review.productId
      );

      if (!currentRatingAndNumRevies) {
        throw new Error("Product not found");
      }

      const { rating, numReviews } = currentRatingAndNumRevies;

      await tx.review.delete({
        where: { id },
      });

      // Calculate new rating
      const newRating = (rating * numReviews - review.rating) / (numReviews - 1);

      await tx.product.update({
        where: { id: review.productId },
        data: {
          rating: newRating,
          numReviews: {
            decrement: 1,
          },
        },
      });
    });
  },

  getByUserAndProduct: async (userId: string, productId: string): Promise<PrismaReview | null> => {
    return await ReviewRepository.findByUserAndProduct(userId, productId);
  },
};
