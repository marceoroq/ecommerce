"use server";

import { revalidatePath } from "next/cache";

import { OrderService } from "@/lib/services/order.services";
import { PaypalService } from "@/lib/payments/paypal.services";
import { StripeService } from "@/lib/payments/stripe.service";

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

export async function createStripePaymentIntentAction(amount: number, orderId: string) {
  try {
    const order = await OrderService.getOrderById(orderId);

    if (!order) throw new Error("Order not found");
    if (order.isPaid) throw new Error("This order has already been paid");
    if (order.paymentMethod !== "stripe") throw new Error("Order payment method is not Stripe");

    if (order.stripePaymentIntentId) {
      const paymentIntent = await StripeService.getPaymentIntent(order.stripePaymentIntentId);

      if (["succeeded", "canceled"].includes(paymentIntent.status)) {
        throw new Error("Payment Intent already processed");
      }

      // TEMPORARY: This validation and update is only for reusing test transactions
      // TODO: When paymentIntent.metadata.orderId doesn't match the orderId in database,
      // we should implement proper error handling or recovery mechanism
      if (paymentIntent.amount !== amount || paymentIntent.metadata.orderId !== orderId) {
        await StripeService.updatePaymentIntent(order.stripePaymentIntentId, amount, orderId);
      }

      return {
        success: true,
        message: "Stripe Payment Intent Created Successfully",
        clientSecret: paymentIntent.client_secret,
      };
    }

    const paymentIntent = await StripeService.createPaymentIntent(amount, orderId);

    await OrderService.updateOrder(orderId, {
      stripePaymentIntentId: paymentIntent.id,
    });

    return {
      success: true,
      message: "Stripe Payment Intent Created Successfully",
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error("[Create Stripe Payment Intent Action Error]", error);

    if (error instanceof Error) {
      return { success: false, message: error.message };
    }

    return { success: false, message: "Error creating Stripe Payment Intent" };
  }
}

export async function markOrderAsPaid(orderId: string) {
  try {
    const order = await OrderService.getOrderById(orderId);
    if (!order) throw new Error("Order not found");

    await OrderService.updateOrderToPaid(orderId);

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: "The order has been marked as paid" };
  } catch (error) {
    console.error("[Mark Order as Paid Action error]", error);
    return { success: false, message: "Error marking order as paid" };
  }
}

export async function markOrderAsDelivered(orderId: string) {
  try {
    const order = await OrderService.getOrderById(orderId);
    if (!order) throw new Error("Order not found");

    await OrderService.updateOrderToDelivered(orderId);

    revalidatePath(`/order/${orderId}`);

    return { success: true, message: "The order has been marked as delivered" };
  } catch (error) {
    console.error("[Mark Order as Delivered Action error]", error);
    return { success: false, message: "Error marking order as delivered" };
  }
}

export async function deleteOrderByIdAction(orderId: string) {
  try {
    await OrderService.deleteOrderById(orderId);
    return { success: true, message: "Order deleted successfully" };
  } catch (error) {
    console.error("[Delete Order Action error]", error);
    return { success: false, message: "Error trying to delete order" };
  }
}
