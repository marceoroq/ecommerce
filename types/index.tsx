import { z } from "zod";
import {
  insertCartSchema,
  insertProductSchema,
  insertCartItemSchema,
} from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating?: number;
  numReviews?: number;
  createdAt: Date;
  updateAt: Date;
};

export type Cart = z.infer<typeof insertCartSchema>;
export type CartItem = z.infer<typeof insertCartItemSchema>;

export type FieldErrors = {
  email?: string[];
  password?: string[];
  name?: string[];
  confirmPassword?: string[];
  [key: string]: string[] | undefined;
};
