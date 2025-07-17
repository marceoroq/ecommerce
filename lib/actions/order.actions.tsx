"use server";

import { OrderService } from "@/lib/services/order.services";

export async function createOrderAction() {
  try {
    const orderId = await OrderService.createOrder();

    return {
      success: true,
      message: "Order created",
      redirectTo: `/order/${orderId}`,
    };
  } catch (error) {
    type ErrorMapping = {
      message: string;
      redirectTo: string;
    };

    const ERROR_MAPPINGS: Record<string, ErrorMapping> = {
      VALIDATION_CART_EMPTY: {
        message: "Your cart is empty",
        redirectTo: "/cart",
      },
      VALIDATION_NO_ADDRESS: {
        message: "Shipping address required",
        redirectTo: "/shipping-address",
      },
      VALIDATION_NO_PAYMENT_METHOD: {
        message: "Payment method required",
        redirectTo: "/payment-method",
      },
    };

    const DEFAULT_ERROR: ErrorMapping = {
      message: "Failed to process request",
      redirectTo: "/cart",
    };

    const errorCode = error instanceof Error ? error.message : "UNKNOWN_ERROR";
    console.error("[Order Action]", errorCode);

    const { message, redirectTo } = ERROR_MAPPINGS[errorCode] || DEFAULT_ERROR;

    return {
      success: false,
      message,
      redirectTo,
    };
  }
}
