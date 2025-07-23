"use server";

import { ProductService } from "@/lib/services/product.services";

import { AddProductForm, UpdateProductForm } from "@/types";
import { createProductSchema, updateProductSchema } from "@/lib/validators";

export async function createProductAction(data: AddProductForm) {
  try {
    const validatedProduct = createProductSchema.parse(data);
    await ProductService.createProduct(validatedProduct);
    return { success: true, message: "Product created successfully" };
  } catch (error) {
    console.error("[Create Product Action]", error);
    return { success: false, message: "Failed to create product" };
  }
}
export async function updateProductAction(productId: string, data: UpdateProductForm) {
  try {
    const validatedProduct = updateProductSchema.parse(data);
    await ProductService.updateProduct(productId, validatedProduct);
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
