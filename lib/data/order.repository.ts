import "server-only";

import prisma from "@/lib/prisma";
import {
  Order as PrismaModel,
  OrderItem as PrismaOrderItem,
  Prisma,
} from "@/lib/generated/prisma";
import { OrderItem } from "@/types";

export type OrderWithItemsAndUser = PrismaModel & {
  OrderItem: PrismaOrderItem[];
};

export const OrderRepository = {
  findAll: async (options?: Prisma.OrderFindManyArgs): Promise<PrismaModel[]> =>
    await prisma?.order.findMany(options),

  findById: async <T extends Prisma.OrderFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrderFindUniqueArgs>
  ): Promise<Prisma.OrderGetPayload<T> | null> => {
    return await prisma.order.findUnique(args);
  },

  findByIdWithDetails: async (
    id: string
  ): Promise<OrderWithItemsAndUser | null> => {
    return prisma.order.findUnique({
      where: { id },
      include: {
        OrderItem: true,
        user: { select: { name: true, email: true } },
      },
    });
  },

  create: async (
    data: Omit<Prisma.OrderCreateInput, "user"> & {
      userId: string;
      items: OrderItem[];
    },
    cartId: string
  ): Promise<string> => {
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
  },

  createMany: async (
    data: Prisma.OrderCreateManyInput[]
  ): Promise<Prisma.BatchPayload> => await prisma.order.createMany({ data }),

  update: async (
    id: string,
    data: Prisma.OrderUpdateInput
  ): Promise<PrismaModel> =>
    await prisma.order.update({
      where: { id },
      data,
    }),

  delete: async (id: string): Promise<PrismaModel> =>
    await prisma.order.delete({ where: { id } }),

  deleteMany: async (
    options?: Prisma.OrderDeleteManyArgs
  ): Promise<Prisma.BatchPayload> => await prisma.order.deleteMany(options),
};
