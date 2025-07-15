"use server";

import { auth } from "@/lib/auth";
import { getUserById } from "@/lib/services/user.services";
import { createOrder } from "@/lib/services/order.services";
import { getCurrentCart } from "@/lib/actions/cart.actions";
import { insertOrderSchema } from "@/lib/validators";

export async function createOrderAction() {
  try {
    const session = await auth();
    if (!session) throw new Error("User is not authenticated");

    const userId = session?.user?.id;
    if (!userId) throw new Error("User not found");

    const cart = await getCurrentCart();
    const user = await getUserById(userId);

    if (!cart || cart.items.length === 0) {
      return {
        success: false,
        message: "Your cart is empty",
        redirectTo: "/cart",
      };
    }

    if (!user?.address) {
      return {
        success: false,
        message: "No shipping address",
        redirectTo: "/shipping-address",
      };
    }

    if (!user?.paymentMethod) {
      return {
        success: false,
        message: "No payment method",
        redirectTo: "/payment-method",
      };
    }

    const itemsPrice = (
      cart.items.reduce((acc, item) => {
        return acc + Number(item.price) * item.quantity;
      }, 0) || 0
    ).toFixed(2);

    const totalPrice = (
      Number(itemsPrice) +
      Number(cart.shippingPrice) +
      Number(cart.taxPrice)
    ).toFixed(2);

    // Create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice,
      items: cart.items,
    });

    // Create a transaction to create order and order items
    const createdOrderId = await createOrder(order, cart.id);

    if (!createdOrderId) throw new Error("Order not created");

    return {
      success: true,
      message: "Order created successfully",
      redirectTo: `/order/${createdOrderId}`,
    };
  } catch (error) {
    console.error("[Create Order Action Error]:", error);
    return { success: false, message: String(error) };
  }
}
