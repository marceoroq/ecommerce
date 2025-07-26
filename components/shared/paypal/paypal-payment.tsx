"use client";

import { toast } from "sonner";
import {
  PayPalButtons,
  PayPalScriptProvider,
  ReactPayPalScriptOptions,
} from "@paypal/react-paypal-js";

import { approvePayPalOrder, createPayPalOrder } from "@/lib/actions/order.actions";

import { PayPalLoadingStatus } from "@/components/shared/paypal/paypal-loading-status";

type PayPalPaymentProps = {
  orderId: string;
  options: ReactPayPalScriptOptions;
};

export const PayPalPayment = ({ orderId, options }: PayPalPaymentProps) => {
  async function handleCreateOrder(): Promise<string> {
    const response = await createPayPalOrder(orderId);

    if (!response.success) {
      toast.error(response.message);
      throw new Error(response.message);
    }

    return response.paypalOrderId;
  }

  async function handleApprove({ orderID: paypalOrderId }: { orderID: string }): Promise<void> {
    const response = await approvePayPalOrder(orderId, paypalOrderId);

    if (!response.success) {
      toast.error(response.message);
    } else {
      toast.success(response.message);
    }
  }

  return (
    // The colorSheme style is to avoid a white background in dark mode
    <div style={{ colorScheme: "none" }}>
      <PayPalScriptProvider options={options}>
        <PayPalLoadingStatus />
        <PayPalButtons
          style={{ color: "blue" }}
          createOrder={handleCreateOrder}
          onApprove={handleApprove}
        />
      </PayPalScriptProvider>
    </div>
  );
};
