export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Zephyr";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION || "A modern ecommerce platform built with Next.JS";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const SHIPPING_ADDRESS_DEFAULT = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};

export const PAYMENT_METHODS = ["paypal", "stripe", "cash"];
export const PAYMENT_METHOD_DEFAULT = "stripe";

export const ORDERS_PAGE_SIZE = 5;

export const VALID_ROLES = ["admin", "user"];

export const REVIEWS_PER_PAGE = 5;

export const SENDER_EMAIL = process.env.SENDER_EMAIL || "onboarding@resend.dev";
