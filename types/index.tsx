import { z } from "zod";
import {
  insertCartSchema,
  insertProductSchema,
  insertCartItemSchema,
  shippingAddressSchema,
  paymentMethodSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentResultSchema,
  updateUserProfileSchema,
  updateUserAsAdminSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating?: number;
  numReviews?: number;
  createdAt: Date;
  updateAt: Date;
};

export type CartItem = z.infer<typeof insertCartItemSchema>;
export type Cart = z.infer<typeof insertCartSchema> & {
  id: string;
};

export type ShippingAddress = z.infer<typeof shippingAddressSchema>;

export type FieldErrors = {
  email?: string[];
  password?: string[];
  name?: string[];
  confirmPassword?: string[];
  [key: string]: string[] | undefined;
};

export type PaymentMethod = z.infer<typeof paymentMethodSchema>;

export type OrderItem = z.infer<typeof insertOrderItemSchema>;
export type Order = z.infer<typeof insertOrderSchema> & {
  id: string;
  isPaid: boolean;
  isDelivered: boolean;
  paidAt: Date | null;
  deliveredAt: Date | null;
  paypalResult: PaypalResult | null;
  createdAt: Date;
  updatedAt: Date;
  // user: {name: string, email: string}
};

export type PaypalResult = z.infer<typeof paymentResultSchema> & {
  createTime?: string;
  updateTime?: string;
};

type PayPalPayer = {
  payer_id: string;
  email_address: string;
};

type PayPalAmount = {
  currency_code: string;
  value: string;
};

type PayPalCapture = {
  amount: PayPalAmount;
};

type PayPalPayments = {
  captures: PayPalCapture[];
};

type PayPalPurchaseUnit = {
  payments: PayPalPayments;
};

export type PayPalCaptureResponse = {
  id: string;
  status: string;
  payer: PayPalPayer;
  purchase_units: PayPalPurchaseUnit[];
};

export type UserProfile = z.infer<typeof updateUserProfileSchema>;
export type AdminUpdateUser = z.infer<typeof updateUserAsAdminSchema>;
