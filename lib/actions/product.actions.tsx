"use server";

import { Product } from "@/types";
import { getProductBySlug, getProducts } from "@/lib/services/product.services";
import {
  convertPrismaProductsToPOJO,
  convertPrismaProductToPOJO,
} from "@/lib/serializer/product.serializer";

export async function getProductsAction(): Promise<Product[]> {
  try {
    const products = await getProducts();
    return convertPrismaProductsToPOJO(products);
  } catch (error) {
    throw new Error(
      `Failed to fetch products: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}

export async function getProductBySlugAction(
  slug: string
): Promise<Product | null> {
  try {
    const product = await getProductBySlug(slug);

    if (!product) {
      return null;
    }

    return convertPrismaProductToPOJO(product);
  } catch (error) {
    throw new Error(
      `Failed to fetch product by slug "${slug}": ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
