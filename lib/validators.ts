import {z} from 'zod'

const currencyValidation = z
  .string()
  .refine(
    (value) => /^\d+\.\d{2}$/.test(value),
    'Price must have exactly two decimal places (e.g., 123.45 or 10.00)'
  );

// Schema for inserting products
export const insertProductSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters'),
  category: z.string().min(3, 'Category must be at least 3 characters'),
  images: z.array(z.string()).min(1, 'Product must have at least one image'),
  brand: z.string().min(3, 'Brand must be at least 3 characters'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  stock: z.coerce.number(),
  price: currencyValidation,
  isFeatured: z.boolean(),
  banner: z.string().nullable(),
});