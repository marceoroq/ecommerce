import { z } from "zod";
import { insertProductSchema } from "@/lib/validators";

export type Product = z.infer<typeof insertProductSchema> & {
  id: string;
  rating?: number;
  numReviews?: number;
  createdAt: Date;
  updateAt: Date;
};

export type FieldErrors = {
  email?: string[];
  password?: string[];
  name?: string[];
  confirmPassword?: string[];
  [key: string]: string[] | undefined;
};
