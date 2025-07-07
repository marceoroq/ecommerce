import prisma from "@/lib/prisma";
import { User as PrismaModel, Prisma } from "@/lib/generated/prisma";

// ===========================================================
// READ OPERATIONS
// ===========================================================

/**
 * Retrieves multiple User records from the database.
 * @param options Prisma findMany options (where, orderBy, include, select, etc.)
 * @returns A list of User records.
 */
export async function getUsers(
  options?: Prisma.UserFindManyArgs
): Promise<PrismaModel[]> {
  return await prisma.user.findMany(options);
}

/*
/**
 * Retrieves a single User record by its unique identifier.
 * @param id The unique ID of the User to retrieve.
 * @param options Prisma findUnique options (include, select, etc.)
 * @returns The User record or null if not found.
 */
export async function getUserById(
  id: string,
  options?: Prisma.UserFindUniqueArgs
): Promise<PrismaModel | null> {
  return await prisma.user.findUnique({
    where: { id },
    ...options,
  });
}

/**
 * Retrieves a single User record by a unique field (e.g., slug, email).
 * @param fieldName The name of the unique field (e.g., 'slug', 'email').
 * @param value The value of the unique field.
 * @param options Prisma findUnique options (include, select, etc.)
 * @returns The User record or null if not found.
 */
export async function getUserByEmail(
  email: string,
  options?: Prisma.UserFindUniqueArgs
): Promise<PrismaModel | null> {
  return await prisma.user.findUnique({
    where: { email },
    ...options,
  });
}

// ===========================================================
// WRITE OPERATIONS
// ===========================================================

/**
 * Creates a new User record.
 * @param data The data for the new User. Define a specific interface for clarity.
 * Example: { name: string, description: string, price: number }
 * @returns The newly created User record.
 */
export async function createUser(
  data: Prisma.UserCreateInput
): Promise<PrismaModel> {
  return await prisma.user.create({ data });
}

/**
 * Creates multiple User records.
 * @param data An array of data for the new User records.
 * @returns A Prisma BatchPayload with the count of created records.
 */
export async function createManyUsers(
  data: Prisma.UserCreateManyInput[]
): Promise<Prisma.BatchPayload> {
  return await prisma.user.createMany({ data });
}

/**
 * Updates an existing User record.
 * @param id The unique ID of the User to update.
 * @param data The data to update the User with. Define a specific interface if needed.
 * @returns The updated User record.
 */
export async function updateUser(
  id: string,
  data: Prisma.UserUpdateInput
): Promise<PrismaModel> {
  return await prisma.user.update({
    where: { id },
    data,
  });
}

/**
 * Deletes a single User record by its unique identifier.
 * @param id The unique ID of the User to delete.
 * @returns The deleted User record.
 */
export async function deleteUser(id: string): Promise<PrismaModel> {
  return await prisma.user.delete({
    where: { id },
  });
}

/**
 * Deletes multiple User records based on criteria.
 * This is often used in seeding or administrative tasks.
 * @param options Prisma deleteMany options (where).
 * @returns A Prisma BatchPayload with the count of deleted records.
 */
export async function deleteManyUsers(
  options?: Prisma.UserDeleteManyArgs
): Promise<Prisma.BatchPayload> {
  return await prisma.user.deleteMany(options);
}
