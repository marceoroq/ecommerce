import prisma from "@/lib/prisma";
import { Order as PrismaModel, Prisma } from "@/lib/generated/prisma";
import { OrderItem } from "@/types";

// ===========================================================
// READ OPERATIONS
// ===========================================================

/**
 * Retrieves multiple Order records from the database.
 * @param options Prisma findMany options (where, orderBy, include, select, etc.)
 * @returns A list of Order records.
 */
export async function getOrders(
  options?: Prisma.OrderFindManyArgs
): Promise<PrismaModel[]> {
  return await prisma.order.findMany(options);
}

/*
/**
 * Retrieves a single Order record by its unique identifier.
 * @param id The unique ID of the Order to retrieve.
 * @param options Prisma findUnique options (include, select, etc.)
 * @returns The Order record or null if not found.
 */
export async function getOrderById(
  id: string,
  options?: Prisma.OrderFindFirstArgs
): Promise<PrismaModel | null> {
  return await prisma.order.findFirst({
    where: { id },
    ...options,
  });
}

// ===========================================================
// WRITE OPERATIONS
// ===========================================================

/**
 * Creates a new Order record.
 * @param data The data for the new Order. Define a specific interface for clarity.
 * Example: { name: string, description: string, price: number }
 * @returns The newly created Order record.
 */
export async function createOrder(
  data: Omit<Prisma.OrderCreateInput, "user"> & {
    userId: string;
    items: OrderItem[];
  },
  cartId: string
): Promise<string> {
  const { userId, items, ...orderData } = data;

  return await prisma.$transaction(async (tx) => {
    // First create order
    const createdOrder = await tx.order.create({
      data: {
        ...orderData,
        // use connect because the order has relation with user
        // in prisma
        user: { connect: { id: userId } },
      },
    });

    // Then create order items from the cart items
    await tx.orderItem.createMany({
      data: items.map((item) => ({
        ...item,
        orderId: createdOrder.id,
      })),
    });

    // Clear cart
    await tx.cart.update({
      where: { id: cartId },
      data: {
        items: [],
        shippingPrice: 0,
        taxPrice: 0,
      },
    });

    return createdOrder.id;
  });
}

/**
 * Creates multiple Order records.
 * @param data An array of data for the new Order records.
 * @returns A Prisma BatchPayload with the count of created records.
 */
export async function createManyOrders(
  data: Prisma.OrderCreateManyInput[]
): Promise<Prisma.BatchPayload> {
  return await prisma.order.createMany({ data });
}

/**
 * Updates an existing Order record.
 * @param id The unique ID of the Order to update.
 * @param data The data to update the Order with. Define a specific interface if needed.
 * @returns The updated Order record.
 */
export async function updateOrder(
  id: string,
  data: Prisma.OrderUpdateInput
): Promise<PrismaModel> {
  return await prisma.order.update({
    where: { id },
    data,
  });
}

/**
 * Deletes a single Order record by its unique identifier.
 * @param id The unique ID of the Order to delete.
 * @returns The deleted Order record.
 */
export async function deleteOrder(id: string): Promise<PrismaModel> {
  return await prisma.order.delete({
    where: { id },
  });
}

/**
 * Deletes multiple Order records based on criteria.
 * This is often used in seeding or administrative tasks.
 * @param options Prisma deleteMany options (where).
 * @returns A Prisma BatchPayload with the count of deleted records.
 */
export async function deleteManyOrders(
  options?: Prisma.OrderDeleteManyArgs
): Promise<Prisma.BatchPayload> {
  return await prisma.order.deleteMany(options);
}
