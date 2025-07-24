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

export const ProductService = {
  getProducts: async (searchTerm?: string): Promise<Product[]> => {
    try {
      const products = await ProductRepository.findAll({
        where: { name: { contains: searchTerm, mode: "insensitive" } },
        orderBy: { name: "asc" },
      });

      return products.map((product) => convertPrismaProductToPOJO(product));
    } catch (error) {
      handleRepositoryError(error, "getAllProducts");
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
