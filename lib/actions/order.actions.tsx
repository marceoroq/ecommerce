"use server";

import { revalidatePath } from "next/cache";

import { OrderService } from "@/lib/services/order.services";
import { PaypalService } from "@/lib/payments/paypal.services";

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

export async function createPayPalOrder(orderId: string) {
  try {
    const order = await OrderService.getOrderById(orderId);
    if (!order) throw new Error("Order not found");

    const paypalOrder = await PaypalService.createOrder(Number(order.totalPrice));

    await OrderService.updateOrder(orderId, {
      paypalResult: {
        id: paypalOrder.id,
        status: "",
        pricePaid: 0,
        payer: {
          emailAddress: "",
          payerId: "",
        },
      },
    });

    return {
      success: true,
      message: "Paypal Order Created Successfully",
      paypalOrderId: paypalOrder.id,
    };
  } catch (error) {
    console.error("[Create Paypal Order Action Error]", error);
    return { success: false, message: "Error creating Paypal Order" };
  }
}

export async function approvePayPalOrder(orderId: string, paypalOrderId: string) {
  try {
    const order = await OrderService.getOrderById(orderId);
    if (!order) throw new Error("Order not found");

    const captureData = await PaypalService.capturePayment(paypalOrderId);

    if (
      !captureData ||
      captureData.id !== order.paypalResult?.id ||
      captureData.status !== "COMPLETED"
    ) {
      throw new Error("Error in PayPal payment");
    }

    await OrderService.updateOrderToPaid(orderId, {
      id: captureData.id,
      status: captureData.status,
      pricePaid: captureData.purchase_units[0].payments.captures[0].amount.value,
      payer: {
        emailAddress: captureData.payer.email_address,
        payerId: captureData.payer.payer_id,
      },
    });

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: "Your order has been paid" };
  } catch (error) {
    console.error("[Approve PayPal Order Action error]", error);
    return { success: false, message: "Error approving Paypal Order" };
  }
}

export async function deleteOrderByIdAction(orderId: string) {
  try {
    await OrderService.deleteOrderById(orderId);
  } catch (error) {
    console.error("[Delete Order Action error]", error);
    return { success: false, message: "Error trying to delete order" };
  }
}
