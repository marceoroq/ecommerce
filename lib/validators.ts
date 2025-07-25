import { z } from "zod";

import { PAYMENT_METHODS, VALID_ROLES } from "@/lib/constants";

const currencyValidation = z
  .string()
  .refine(
    (value) => /^\d+\.\d{2}$/.test(value),
    "Price must have exactly two decimal places (e.g., 123.45 or 10.00)"
  );

// Schema for inserting products
export const createProductSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters"),
  category: z.string().min(3, "Category must be at least 3 characters"),
  images: z.array(z.string()),
  brand: z.string().min(3, "Brand must be at least 3 characters"),
  description: z.string().min(3, "Description must be at least 3 characters"),
  stock: z.coerce.number(),
  price: currencyValidation,
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
});

export const updateProductSchema = createProductSchema.partial().extend({
  id: z.string().uuid("Invalid product ID format"),
});

// Schema for sign in form using credentials
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"], // this line is to associate the error with confirmPassword field
  });

export const insertCartItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().optional().nullable(),
  price: currencyValidation,
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const insertCartSchema = z.object({
  userId: z.string().uuid("Invalid User ID format").nullable().optional(),
  items: z.array(insertCartItemSchema),
  shippingPrice: currencyValidation,
  taxPrice: currencyValidation,
  sessionCartId: z.string().uuid("Invalid session ID format"),
});

// Schema for the shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Name must be at least 3 characters"),
  streetAddress: z.string().min(3, "Address must be at least 3 characters"),
  city: z.string().min(3, "City must be at least 3 characters"),
  postalCode: z.string().min(3, "Postal code must be at least 3 characters"),
  country: z.string().min(3, "Country must be at least 3 characters"),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

export const paymentMethodSchema = z.object({
  type: z
    .string()
    .min(1, "Payment method is required")
    .refine((value) => PAYMENT_METHODS.includes(value), {
      message: "Invalid payment method",
    }),
});

export const insertOrderItemSchema = z.object({
  productId: z.string().uuid("Invalid product ID format"),
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().optional().nullable(),
  price: currencyValidation,
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export const insertOrderSchema = z.object({
  userId: z.string().uuid("Invalid User ID format"),
  shippingAddress: shippingAddressSchema, // puedes especificar estructura si querés
  paymentMethod: z.string().refine((value) => PAYMENT_METHODS.includes(value), {
    message: "Invalid payment method",
  }),
  itemsPrice: currencyValidation,
  shippingPrice: currencyValidation,
  taxPrice: currencyValidation,
  totalPrice: currencyValidation,
  items: z.array(insertOrderItemSchema).min(1, "At least one item is required"),
});

export const paymentResultSchema = z.object({
  id: z.string(),
  status: z.string(),
  pricePaid: z.string(),
  payer: z.object({
    emailAddress: z.string(),
    payerId: z.string(),
  }),
});

export const updateUserProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
});

export const updateUserAsAdminSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  role: z.string().refine((value) => VALID_ROLES.includes(value), {
    message: "Invalid selected role",
  }),
});

export const createReviewSchema = z.object({
  rating: z.coerce.number().int().min(1).max(5),
  title: z.string().min(3, "Title must be at least 3 characters"),
  comment: z.string().min(3, "Comment must be at least 3 characters"),
});
