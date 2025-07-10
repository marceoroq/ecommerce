import prisma from "@/lib/prisma";
import { CartItem } from "@/types";
import { Cart as PrismaModel, Prisma } from "@/lib/generated/prisma";

// ===========================================================
// READ OPERATIONS
// ===========================================================

/**
 * Retrieves multiple Cart records from the database.
 * @param options Prisma findMany options (where, orderBy, include, select, etc.)
 * @returns A list of Cart records.
 */
export async function getCarts(
  options?: Prisma.CartFindManyArgs
): Promise<PrismaModel[]> {
  return await prisma.cart.findMany(options);
}

/**
 * Retrieves a single Cart record by a unique identifier.
 * @param where A Prisma `CartWhereUniqueInput` object specifying the unique field and its value.
 * @param options Optional Prisma `CartFindUniqueArgs` for including related data or selecting specific fields.
 * @returns The Cart record or null if not found.
 */
export async function getCart(
  where: Prisma.CartWhereInput,
  options?: Omit<Prisma.CartFindFirstArgs, "where"> // Omit 'where' as it's passed separately
): Promise<PrismaModel | null> {
  return await prisma.cart.findFirst({ where, ...options });
}

/*
/**
 * Retrieves a single Cart record by its unique identifier.
 * @param id The unique ID of the Cart to retrieve.
 * @param options Prisma findUnique options (include, select, etc.)
 * @returns The Cart record or null if not found.
 */
export async function getCartById(
  id: string,
  options?: Prisma.CartFindUniqueArgs
): Promise<PrismaModel | null> {
  return await prisma.cart.findUnique({
    where: { id },
    ...options,
  });
}

export async function getCartItemQuantity(
  productId: string,
  sessionCartId: string | undefined
): Promise<number> {
  const cart = await getCart({ sessionCartId });

  return (
    (cart?.items as CartItem[]).find((item) => item.productId === productId)
      ?.quantity || 0
  );
}

// ===========================================================
// WRITE OPERATIONS
// ===========================================================

/**
 * Creates a new Cart record.
 * @param data The data for the new Cart. Define a specific interface for clarity.
 * Example: { name: string, description: string, price: number }
 * @returns The newly created Cart record.
 */
export async function createCart(
  data: Prisma.CartCreateInput
): Promise<PrismaModel> {
  // If you need to transform or add default values, do it here.
  // Example for Product data:
  // const processedData = {
  //   ...data,
  //   slug: data.name.toLowerCase().replace(/\s+/g, '-'), // Example: generate slug from name
  //   createdAt: new Date(),
  // };
  // return await prisma.cart.create({ data: processedData });
  return await prisma.cart.create({ data });
}

/**
 * Creates multiple Cart records.
 * @param data An array of data for the new Cart records.
 * @returns A Prisma BatchPayload with the count of created records.
 */
export async function createManyCarts(
  data: Prisma.CartCreateManyInput[]
): Promise<Prisma.BatchPayload> {
  return await prisma.cart.createMany({ data });
}

/**
 * Updates an existing Cart record.
 * @param id The unique ID of the Cart to update.
 * @param data The data to update the Cart with. Define a specific interface if needed.
 * @returns The updated Cart record.
 */
export async function updateCart(
  id: string,
  data: Prisma.CartUpdateInput
): Promise<PrismaModel> {
  return await prisma.cart.update({
    where: { id },
    data,
  });
}

/**
 * Deletes a single Cart record by its unique identifier.
 * @param id The unique ID of the Cart to delete.
 * @returns The deleted Cart record.
 */
export async function deleteCart(id: string): Promise<PrismaModel> {
  return await prisma.cart.delete({
    where: { id },
  });
}

/**
 * Deletes multiple Cart records based on criteria.
 * This is often used in seeding or administrative tasks.
 * @param options Prisma deleteMany options (where).
 * @returns A Prisma BatchPayload with the count of deleted records.
 */
export async function deleteManyCarts(
  options?: Prisma.CartDeleteManyArgs
): Promise<Prisma.BatchPayload> {
  return await prisma.cart.deleteMany(options);
}
