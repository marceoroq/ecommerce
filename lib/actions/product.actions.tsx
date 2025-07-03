"use server";

import { getProducts } from "@/lib/services/product.services";
import { toPlainObject } from "@/lib/utils";

export async function getProductsAction() {
  try {
    const products = await getProducts();
    return toPlainObject(products);
  } catch (error) {
    throw new Error(
      `Failed to fetch products: ${
        error instanceof Error ? error.message : String(error)
      }`
    );
  }
}
