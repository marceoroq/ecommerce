import { z } from "zod";
import {
  insertCartSchema,
  insertCartItemSchema,
  shippingAddressSchema,
  paymentMethodSchema,
  insertOrderItemSchema,
  insertOrderSchema,
  paymentResultSchema,
  updateUserProfileSchema,
  updateUserAsAdminSchema,
  createProductSchema,
  updateProductSchema,
  createReviewSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof createProductSchema> & {
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
  stripePaymentIntentId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  user?: { name: string | null; email: string };
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

export type UpdateProductForm = z.infer<typeof updateProductSchema>;
export type AddProductForm = z.infer<typeof createProductSchema>;

export type CreateReviewForm = z.infer<typeof createReviewSchema>;
export type Review = CreateReviewForm & {
  id: string;
  userId: string;
  productId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string;
    image?: string;
  };
};
