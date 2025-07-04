"use server";

import { Product } from "@/types";
import { getProducts } from "@/lib/services/product.services";
import { convertPrismaProductsToPOJO } from "@/lib/serializer/product.serializer";

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
