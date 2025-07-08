"use server";

import { delay } from "../utils";

export async function addItemToCartAction(productId: string) {
  await delay(2000);
  return { success: true, message: "Item added to cart successfully" };
}
