"use server";

import zod from "zod";
import { cookies } from "next/headers";

import { auth } from "@/lib/auth";
import { Cart } from "@/lib/generated/prisma";
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

export async function manageCartItemAdditionAction(itemData: CartItem) {
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

    // Create a variable to save the message to send in response.
    let message = "Product has been added to cart";

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
        // Checks if the quantity to add exceeds the available stock
        if (
          productInDB.stock <
          productInCart.quantity + validatedItem.quantity
        ) {
          throw new Error("Not enough stock");
        }

        // The product is in the cart, we'll update its quantity.
        const updatedItems = (cart.items as CartItem[]).map((item) =>
          item.productId === validatedItem.productId
            ? { ...item, quantity: item.quantity + validatedItem.quantity }
            : item
        );

        await updateCart(cart.id, {
          items: updatedItems,
        });

        message = "Cart quantity updated for product.";
      } else {
        // If the product isn't in the cart, we'll add it.
        await updateCart(cart.id, {
          items: [...(cart.items as CartItem[]), validatedItem],
        });
      }
    }

    // TODO: analize when will be neccessary
    // revalidatePath(`/product/${productInDB.slug}`);

    return { success: true, message };
  } catch (error) {
    console.error("[manageCartItemAdditionAction Error]:", error);

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

export async function decreaseCartItemQuantityAction(
  productId: string,
  quantityToRemove: number
) {
  try {
    // Get current cart
    const cart = await getCurrentCart();

    if (!cart) {
      return { success: false, message: "Cart not found" };
    }

    let message = "Item removed from cart.";

    // Checks if the current removal operation will result in zero
    // quantity for this product in the cart.
    const willRemoveAllQuantity =
      (cart.items as CartItem[]).find((item) => item.productId === productId)
        ?.quantity === quantityToRemove;

    if (willRemoveAllQuantity) {
      const updatedItems = (cart.items as CartItem[]).filter(
        (item) => item.productId !== productId
      );

      await updateCart(cart.id, {
        items: updatedItems,
      });
    } else {
      // We'll update its quantity.
      const updatedItems = (cart.items as CartItem[]).map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - quantityToRemove }
          : item
      );

      await updateCart(cart.id, {
        items: updatedItems,
      });

      message = "Cart quantity updated for product.";
    }

    return { success: true, message };
  } catch (error) {
    console.error("[decreaseCartItemQuantityAction Error]:", error);
    return { success: false, message: String(error) };
  }
}

export async function removeProductFromCartAction(productId: string) {
  try {
    const cart = await getCurrentCart();

    if (!cart) {
      return { success: false, message: "Cart not found" };
    }

    const updatedItems = (cart.items as CartItem[]).filter(
      (item) => item.productId !== productId
    );

    await updateCart(cart.id, {
      items: updatedItems,
    });

    return { success: true, message: "Item removed from cart." };
  } catch (error) {
    console.error("[removeProductFromCartAction Error]:", error);

    return { success: false, message: String(error) };
  }
}

export async function getCurrentCart(): Promise<Cart | null> {
  try {
    const [userId, sessionCartId] = await getUserAndSessionCartId();

    const cart = await getCart(userId ? { userId } : { sessionCartId });

    return cart;
  } catch (error) {
    console.error("Error trying to get current cart", error);
    throw new Error(`Error trying to get current cart: ${error}`);
  }
}

export async function getCartItemQuantity(productId: string): Promise<number> {
  try {
    const cart = await getCurrentCart();

    if (!cart) throw new Error("Cart not found");

    return (
      (cart?.items as CartItem[]).find((item) => item.productId === productId)
        ?.quantity || 0
    );
  } catch (error) {
    console.error("Error fetching cart item quantity:", error);
    throw error;
  }
}

export async function hasCartItems(): Promise<boolean> {
  try {
    const cart = await getCurrentCart();

    if (!cart) throw new Error("Cart not found");

    return Boolean((cart?.items as CartItem[]).length);
  } catch (error) {
    console.error("Error getting if cart has items:", error);
    throw error;
  }
}
