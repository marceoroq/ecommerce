import "server-only";

import { Product } from "@/types";
import { toPlainObject } from "@/lib/utils";
import { handleDalError } from "@/lib/data/error-handler";
import { Product as PrismaProduct } from "@/lib/generated/prisma";
import { ProductRepository } from "@/lib/data/product.repository";

function convertPrismaProductToPOJO(product: PrismaProduct): Product {
  return {
    ...toPlainObject(product),
    price: product.price.toFixed(2).toString(),
    rating: product.rating.toNumber(),
  };
}

export const ProductService = {
  getProducts: async (): Promise<Product[]> => {
    try {
      const products = await ProductRepository.findAll();

      return products.map((product) => convertPrismaProductToPOJO(product));
    } catch (error) {
      handleDalError(error, "getAllProducts");
    }
  },

  getProductById: async (id: string): Promise<Product | null> => {
    try {
      const product = await ProductRepository.findById(id);
      if (!product) return null;

      return convertPrismaProductToPOJO(product);
    } catch (error) {
      handleDalError(error, "getProductById");
    }
  },

  getProductBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const product = await ProductRepository.findBySlug(slug);
      if (!product) return null;

      return convertPrismaProductToPOJO(product);
    } catch (error) {
      handleDalError(error, "getProductBySlug");
    }
  },
};
