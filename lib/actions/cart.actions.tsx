"use server";

import zod from "zod";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { Decimal } from "@/lib/generated/prisma/runtime/library";
import { getProductById } from "@/lib/services/product.services";
import { insertCartItemSchema, insertCartSchema } from "@/lib/validators";
import { createCart, getCart, updateCart } from "@/lib/services/cart.services";
import { CartItem } from "@/types";

async function getUserAndSessionCartId() {
  const session = await auth();
  const userId = session?.user.id;

  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) {
    throw new Error("Session Cart ID not found");
  }

  return [userId, sessionCartId];
}

export async function addItemToCartAction(itemData: CartItem) {
  try {
    const productInDB = await getProductById(itemData.productId);

    if (!productInDB) {
      return { success: false, message: "Product not found" };
    }

    // Prepare and validate cart item data to be added to the cart.
    const validatedItem = insertCartItemSchema.parse(itemData);

    // Get userId and sessionCartId to find cart in DB.
    const [userId, sessionCartId] = await getUserAndSessionCartId();

    // Get cart with userId or sessionCartId.
    const cart = await getCart(userId ? { userId } : { sessionCartId });

    // If the cart doesn't exist, we'll create it with the product to be added.
    if (!cart) {
      const shippingPrice = "10.00";
      const taxPrice = new Decimal(validatedItem.price)
        .mul(new Decimal(0.21))
        .toFixed(2)
        .toString();

      const validatedFields = insertCartSchema.parse({
        userId,
        shippingPrice,
        taxPrice,
        sessionCartId,
        items: [validatedItem],
      });

      await createCart(validatedFields);
    } else {
      // Verify if the product exist in the cart
      const productInCart = (cart.items as CartItem[]).find(
        (item) => item.productId === validatedItem.productId
      );

      if (productInCart) {
        // Check stock
        if (productInDB.stock < productInCart.quantity + 1) {
          throw new Error("Not enough stock");
        }

        // If the product is in the cart, we'll update its quantity.
        const updatedItems = (cart.items as CartItem[]).map((item) =>
          item.productId === validatedItem.productId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );

        await updateCart(cart.id, {
          items: updatedItems,
        });
      } else {
        // If the product isn't in the cart, we'll add it.
        await updateCart(cart.id, {
          items: [...(cart.items as CartItem[]), validatedItem],
        });
      }
    }

    revalidatePath(`/product/${productInDB.slug}`);

    return { success: true, message: "Product has been added to cart" };
  } catch (error) {
    console.error("Error in Cart Actions:", error);

    if (error instanceof zod.ZodError) {
      return {
        success: false,
        message: "Invalid format",
        errors: error.errors,
      };
    }

    return { success: false, message: String(error) };
  }
}
