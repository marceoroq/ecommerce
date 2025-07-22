"use server";

import { ProductService } from "@/lib/services/product.services";

import { UpdateProductForm } from "@/types";

export async function updateProductAction(productId: string, data: UpdateProductForm) {
  try {
    await ProductService.updateProduct(productId, data);
    return { success: true, message: "Product updated successfully" };
  } catch (error) {
    console.error("[Update Product Action]", error);
    return { success: false, message: "Failed to update product" };
  }
}
export async function deleteProductAction(productId: string) {
  try {
    await ProductService.deleteProduct(productId);
    return { success: true, message: "Product deleted successfully" };
  } catch (error) {
    console.error("[Delete Product Action]", error);
    return { success: false, message: "Failed to delete product" };
  }
}
