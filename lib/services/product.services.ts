import "server-only";

import { toPlainObject } from "@/lib/utils";
import { ProductRepository } from "@/lib/data/product.repository";
import { handleRepositoryError } from "@/lib/data/error-handler";
import { Product as PrismaProduct } from "@/lib/generated/prisma";
import { AddProductForm, Product, UpdateProductForm } from "@/types";

function convertPrismaProductToPOJO(product: PrismaProduct): Product {
  return {
    ...toPlainObject(product),
    price: product.price.toFixed(2).toString(),
    rating: product.rating.toNumber(),
  };
}

interface ProductFilters {
  searchTerm?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  sortBy?: "newest" | "lowest" | "highest" | "rating";
}

export const ProductService = {
  getProducts: async (filters: ProductFilters = {}): Promise<Product[]> => {
    try {
      const { searchTerm, category, minPrice, maxPrice, minRating, sortBy } = filters;

      // Build orderBy clause
      let orderBy: Record<string, string> = { name: "asc" }; // default

      switch (sortBy) {
        case "newest":
          orderBy = { createdAt: "desc" };
          break;
        case "lowest":
          orderBy = { price: "asc" };
          break;
        case "highest":
          orderBy = { price: "desc" };
          break;
        case "rating":
          orderBy = { rating: "desc" };
          break;
      }

      const products = await ProductRepository.findAll({
        where: {
          name: { contains: searchTerm, mode: "insensitive" as const },
          rating: { gte: minRating },
          category: category,
          price: {
            gte: minPrice,
            lte: maxPrice,
          },
        },
        orderBy,
      });

      return products.map((product) => convertPrismaProductToPOJO(product));
    } catch (error) {
      handleRepositoryError(error, "getAllProducts");
    }
  },

  getFeaturedProducts: async (): Promise<Product[]> => {
    try {
      const products = await ProductRepository.findAll({
        where: { isFeatured: true },
        orderBy: { createdAt: "desc" },
        take: 4,
      });

      return products.map((product) => convertPrismaProductToPOJO(product));
    } catch (error) {
      handleRepositoryError(error, "getFeaturedProducts");
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const product = await ProductRepository.findById(id);
      if (!product) return null;

      return convertPrismaProductToPOJO(product);
    } catch (error) {
      handleRepositoryError(error, "getProductById");
    }
  },

  getRatingAndNumReviewsById: async (
    id: string
  ): Promise<{ rating: number; numReviews: number } | null> => {
    try {
      const data = await ProductRepository.findById(id, {
        select: { rating: true, numReviews: true },
      });

      if (!data) return null;

      return {
        rating: data.rating.toNumber() || 0,
        numReviews: data.numReviews || 0,
      };
    } catch (error) {
      handleRepositoryError(error, "getProductById");
    }
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const product = await ProductRepository.findBySlug(slug);
      if (!product) return null;

      return convertPrismaProductToPOJO(product);
    } catch (error) {
      handleRepositoryError(error, "getProductBySlug");
    }
  },

  createProduct: async (data: AddProductForm): Promise<void> => {
    try {
      await ProductRepository.create(data);
    } catch (error) {
      handleRepositoryError(error, "createProduct");
    }
  },

  updateProduct: async (id: string, data: UpdateProductForm): Promise<void> => {
    try {
      await ProductRepository.update(id, data);
    } catch (error) {
      handleRepositoryError(error, "updateProduct");
    }
  },

  deleteProduct: async (id: string): Promise<void> => {
    try {
      await ProductRepository.delete(id);
    } catch (error) {
      handleRepositoryError(error, "deleteProduct");
    }
  },

  getAllCategories: async (): Promise<string[]> => {
    try {
      const categories = await ProductRepository.findAll({
        select: { category: true },
        distinct: ["category"],
      });

      return categories.map((category) => category.category);
    } catch (error) {
      handleRepositoryError(error, "getAllCategories");
    }
  },
};
