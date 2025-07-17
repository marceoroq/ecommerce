"use server";

import zod from "zod";
import { cookies } from "next/headers";

import { Decimal } from "@/lib/generated/prisma/runtime/library";
import { CartService } from "@/lib/services/cart.services";
import { ProductService } from "@/lib/services/product.services";

import { insertCartItemSchema, insertCartSchema } from "@/lib/validators";
import { Cart, CartItem } from "@/types";

async function getCurrentCart(): Promise<Cart | null> {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;
  return await CartService.getCurrentCart(sessionCartId);
}

export async function manageCartItemAdditionAction(itemData: CartItem) {
  try {
    const productInDB = await ProductService.getProductById(itemData.productId);
    if (!productInDB) throw new Error("PRODUCT_NOT_FOUND");

    // Prepare and validate cart item data to be added to the cart.
    const validatedItem = insertCartItemSchema.parse(itemData);

    // Get cart with userId or sessionCartId if exist
    const cart = await getCurrentCart();

    // Create a variable to save the message to send in response.
    let message = "Product has been added to cart";

    // If the cart doesn't exist, we'll create it with the product to be added.
    if (!cart) {
      const sessionCartId = (await cookies()).get("sessionCartId")?.value;
      const shippingPrice = "10.00";
      const taxPrice = new Decimal(validatedItem.price)
        .mul(new Decimal(0.21))
        .toFixed(2)
        .toString();

      const validatedFields = insertCartSchema.parse({
        shippingPrice,
        taxPrice,
        sessionCartId,
        items: [validatedItem],
      });

      await CartService.createCart(validatedFields);
    } else {
      // If cart exist, verify if the product is in and get it
      const productInCart = cart.items.find(
        (item) => item.productId === validatedItem.productId
      );

      // Checks if the quantity to add exceeds the available stock
      const newItemQuantity =
        (productInCart?.quantity || 0) + validatedItem.quantity;

      const hasEnoughStock = productInDB.stock >= newItemQuantity;
      if (!hasEnoughStock) throw new Error("PRODUCT_EXCEED_STOCK");

      if (productInCart) {
        // The product is in the cart, we'll update its quantity.
        const updatedItems = cart.items.map((item) =>
          item.productId === validatedItem.productId
            ? { ...item, quantity: newItemQuantity }
            : item
        );

        await CartService.updateCart(cart.id, {
          items: updatedItems,
        });

        message = "Cart quantity updated for product.";
      } else {
        // If the product isn't in the cart, we'll add it.
        await CartService.updateCart(cart.id, {
          items: [...cart.items, validatedItem],
        });
      }
    }

    return { success: true, message };
  } catch (error) {
    if (error instanceof zod.ZodError) {
      return {
        success: false,
        message: "Invalid format",
        errors: error.errors,
      };
    }

    type ErrorMapping = {
      message: string;
    };

    const ERROR_MAPPINGS: Record<string, ErrorMapping> = {
      PRODUCT_NOT_FOUND: {
        message: "The product was not found",
      },
      PRODUCT_EXCEED_STOCK: {
        message: "Product not enough stock",
      },
    };

    const DEFAULT_ERROR: ErrorMapping = {
      message: "Failed to process request",
    };

    const errorCode = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    console.error("[Cart Action]", errorCode);

    const { message } = ERROR_MAPPINGS[errorCode] || DEFAULT_ERROR;

    return {
      success: false,
      message,
    };
  }
}

export async function decreaseCartItemQuantityAction(
  productId: string,
  quantityToRemove: number
) {
  try {
    const cart = await getCurrentCart();

    if (!cart) {
      return { success: false, message: "Cart not found" };
    }

    let message = "Item removed from cart.";

    // Checks if the current removal operation will result in zero
    // quantity for this product in the cart.
    const willRemoveAllQuantity =
      cart.items.find((item) => item.productId === productId)?.quantity ===
      quantityToRemove;

    if (willRemoveAllQuantity) {
      const updatedItems = cart.items.filter(
        (item) => item.productId !== productId
      );

      await CartService.updateCart(cart.id, {
        items: updatedItems,
      });
    } else {
      // We'll update its quantity.
      const updatedItems = cart.items.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity - quantityToRemove }
          : item
      );

      await CartService.updateCart(cart.id, {
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

    const updatedItems = cart.items.filter(
      (item) => item.productId !== productId
    );

    await CartService.updateCart(cart.id, {
      items: updatedItems,
    });

    return { success: true, message: "Item removed from cart." };
  } catch (error) {
    console.error("[removeProductFromCartAction Error]:", error);

    return { success: false, message: String(error) };
  }
}
