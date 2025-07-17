import "server-only";

import { Product } from "@/types";
import { toPlainObject } from "@/lib/utils";
import { handleDalError } from "@/lib/data/error-handler";
import { Product as PrismaProduct } from "@/lib/generated/prisma";
import { getProductBy, getProducts } from "@/lib/services/product.services";

function convertPrismaProductToPOJO(product: PrismaProduct): Product {
  return {
    ...toPlainObject(product),
    price: product.price.toFixed(2).toString(),
    rating: product.rating.toNumber(),
  };
}

export async function getAllProducts(): Promise<Product[]> {
  try {
    const products = await getProducts();
    return products.map((product) => convertPrismaProductToPOJO(product));
  } catch (error) {
    handleDalError(error, "getAllProducts");
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const product = await getProductBy({ slug });
    if (!product) return null;

    return convertPrismaProductToPOJO(product);
  } catch (error) {
    handleDalError(error, "getProductBySlug");
  }
}

export async function getProductById(id: string): Promise<Product | null> {
  try {
    const product = await getProductBy({ id });
    if (!product) return null;

    return convertPrismaProductToPOJO(product);
  } catch (error) {
    handleDalError(error, "getProductById");
  }
}
