export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Zephyr";
export const APP_DESCRIPTION =
  process.env.NEXT_PUBLIC_APP_DESCRIPTION ||
  "A modern ecommerce platform built with Next.JS";
export const SERVER_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

export const SHIPPING_ADDRESS_DEFAULT = {
  fullName: "",
  streetAddress: "",
  city: "",
  postalCode: "",
  country: "",
};
