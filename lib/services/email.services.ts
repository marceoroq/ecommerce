import "server-only";

import { Resend } from "resend";

import PurchaseReceiptEmailTemplate from "@/components/shared/email/purchase-receipt-email-template";

import { APP_NAME, SENDER_EMAIL } from "../constants";
import { Order } from "@/types";

const resend = new Resend(process.env.RESEND_API_KEY);

export const EmailService = {
  sendOrderReceipt: async (order: Order) => {
    const { error } = await resend.emails.send({
      from: `${APP_NAME} <${SENDER_EMAIL}>`,
      to: "oroquieta.m@gmail.com", // TODO: Change to order.user?.email
      subject: `Order Confirmation ${order.id.slice(0, 7)}`,
      react: PurchaseReceiptEmailTemplate({ order }),
    });

    if (error) {
      console.error("Email sending error:", error);
      console.log("Failed to send order confirmation email:", error.message);
      // Continue execution without throwing
    }
  },
};

// await EmailService.sendOrderReceipt(convertPrismaOrderToPOJO(order));
