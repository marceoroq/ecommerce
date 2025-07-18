import "server-only";

import { PayPalCaptureResponse } from "@/types";

const PAYPAL_API_BASE_URL = process.env.PAYPAL_API_BASE_URL || "https://api-m.sandbox.paypal.com";
const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET_KEY = process.env.PAYPAL_SECRET_KEY;

// Generate paypal access token
async function generateAccessToken() {
  try {
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET_KEY) {
      throw new Error("Missing PAYPAL_CLIENT_ID or PAYPAL_SECRET environment variables.");
    }

    const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET_KEY}`).toString("base64");
    const response = await fetch(`${PAYPAL_API_BASE_URL}/v1/oauth2/token`, {
      method: "POST",
      body: "grant_type=client_credentials",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error fetching Access Token: ${errorMessage}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to generate Access Token:", error);
    throw new Error("Failed to generate Access Token.");
  }
}

export const PaypalService = {
  createOrder: async (price: number) => {
    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_API_BASE_URL}/v2/checkout/orders`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: price,
            },
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error creating order: ${errorMessage}`);
    }

    return await response.json();
  },

  capturePayment: async (orderId: string): Promise<PayPalCaptureResponse> => {
    const accessToken = await generateAccessToken();
    const url = `${PAYPAL_API_BASE_URL}/v2/checkout/orders/${orderId}/capture`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(`Error capturing order payment: ${errorMessage}`);
    }

    return await response.json();
  },
};
