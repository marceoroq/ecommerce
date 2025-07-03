import prisma from "@/lib/prisma";
import { Product as PrismaModel, Prisma } from "@/lib/generated/prisma";

// ===========================================================
// READ OPERATIONS
// ===========================================================

/**
 * Retrieves multiple Product records from the database.
 * @param options Prisma findMany options (where, orderBy, include, select, etc.)
 * @returns A list of Product records.
 */
export async function getProducts(options?: Prisma.ProductFindManyArgs): Promise<PrismaModel[]> {
  return await prisma.product.findMany(options);
}


/**
 * Retrieves a single Product record by its unique identifier.
 * @param id The unique ID of the Product to retrieve.
 * @param options Prisma findUnique options (include, select, etc.)
 * @returns The Product record or null if not found.
 */
export async function getProductById(id: string, options?: Prisma.ProductFindUniqueArgs): Promise<PrismaModel | null> {
  return await prisma.product.findUnique({
    where: { id },
    ...options,
  });
}

/**
 * Retrieves a single Product record by a unique field (e.g., slug, email).
 * @param fieldName The name of the unique field (e.g., 'slug', 'email').
 * @param value The value of the unique field.
 * @param options Prisma findUnique options (include, select, etc.)
 * @returns The Product record or null if not found.
 */
// export async function getProductByUniqueField(fieldName: keyof PrismaModel, value: any, options?: Prisma.ProductFindUniqueArgs): Promise<PrismaModel | null> {
  // Example for a 'slug' field:
  // return await prisma.product.findUnique({
  //   where: { [fieldName]: value },
  //   ...options,
  // });
  // Note: For 'findUnique', Prisma requires the unique field to be explicitly typed in 'where'.
  // You might need to refine this for specific unique fields (e.g., { where: { slug: value as string } })
  // return null; // Placeholder, refine based on specific unique fields
// }

// ===========================================================
// WRITE OPERATIONS
// ===========================================================

/**
 * Creates a new Product record.
 * @param data The data for the new Product. Define a specific interface for clarity.
 * Example: { name: string, description: string, price: number }
 * @returns The newly created Product record.
 */
export async function createProduct(data: Prisma.ProductCreateInput): Promise<PrismaModel> {
  // If you need to transform or add default values, do it here.
  // Example for Product data:
  // const processedData = {
  //   ...data,
  //   slug: data.name.toLowerCase().replace(/\s+/g, '-'), // Example: generate slug from name
  //   createdAt: new Date(),
  // };
  // return await prisma.product.create({ data: processedData });
  return await prisma.product.create({ data });
}

/**
 * Creates multiple Product records.
 * @param data An array of data for the new Product records.
 * @returns A Prisma BatchPayload with the count of created records.
 */
export async function createManyProducts(data: Prisma.ProductCreateManyInput[]): Promise<Prisma.BatchPayload> {
  return await prisma.product.createMany({ data });
}

/**
 * Updates an existing Product record.
 * @param id The unique ID of the Product to update.
 * @param data The data to update the Product with. Define a specific interface if needed.
 * @returns The updated Product record.
 */
export async function updateProduct(id: string, data: Prisma.ProductUpdateInput): Promise<PrismaModel> {
  return await prisma.product.update({
    where: { id },
    data,
  });
}

/**
 * Deletes a single Product record by its unique identifier.
 * @param id The unique ID of the Product to delete.
 * @returns The deleted Product record.
 */
export async function deleteProduct(id: string): Promise<PrismaModel> {
  return await prisma.product.delete({
    where: { id },
  });
}

/**
 * Deletes multiple Product records based on criteria.
 * This is often used in seeding or administrative tasks.
 * @param options Prisma deleteMany options (where).
 * @returns A Prisma BatchPayload with the count of deleted records.
 */
export async function deleteManyProducts(options?: Prisma.ProductDeleteManyArgs): Promise<Prisma.BatchPayload> {
  return await prisma.product.deleteMany(options);
}
