import "server-only";

import prisma from "@/lib/prisma";
import {
  Order as PrismaModel,
  OrderItem as PrismaOrderItem,
  Prisma,
  User,
} from "@/lib/generated/prisma";
import { OrderItem } from "@/types";

type OrderWithItems = PrismaModel & {
  OrderItem: PrismaOrderItem[];
  user: { name: string | null; email: string };
};

export type PrismaSalesByDate = {
  date: string;
  totalSales: Prisma.Decimal;
};

export type OrderWithName = Pick<PrismaModel, "id" | "createdAt" | "totalPrice"> & {
  user: Pick<User, "name">;
};

export const OrderRepository = {
  findAll: async (options?: Prisma.OrderFindManyArgs): Promise<PrismaModel[]> =>
    await prisma?.order.findMany(options),

  findById: async <T extends Prisma.OrderFindUniqueArgs>(
    args: Prisma.SelectSubset<T, Prisma.OrderFindUniqueArgs>,
  ): Promise<Prisma.OrderGetPayload<T> | null> => {
    return await prisma.order.findUnique(args);
  },

  findByIdWithDetails: async (id: string): Promise<OrderWithItems | null> => {
    return prisma.order.findUnique({
      where: { id },
      include: {
        OrderItem: true,
        user: { select: { name: true, email: true } },
      },
    });
  },

  findLatestSales: async (): Promise<OrderWithName[]> =>
    await prisma.order.findMany({
      select: {
        id: true,
        createdAt: true,
        totalPrice: true,
        user: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),

  count: async (options?: Prisma.OrderCountArgs): Promise<number> =>
    await prisma.order.count(options),

  create: async (
    data: Omit<Prisma.OrderCreateInput, "user"> & {
      userId: string;
      items: OrderItem[];
    },
    cartId: string,
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

  createMany: async (data: Prisma.OrderCreateManyInput[]): Promise<Prisma.BatchPayload> =>
    await prisma.order.createMany({ data }),

  update: async (id: string, data: Prisma.OrderUpdateInput): Promise<PrismaModel> =>
    await prisma.order.update({ where: { id }, data }),

  delete: async (options: Prisma.OrderDeleteArgs): Promise<PrismaModel> =>
    await prisma.order.delete(options),

  deleteMany: async (options?: Prisma.OrderDeleteManyArgs): Promise<Prisma.BatchPayload> =>
    await prisma.order.deleteMany(options),

  aggregate: async (
    options: Prisma.OrderAggregateArgs,
  ): Promise<Prisma.GetOrderAggregateType<Prisma.OrderAggregateArgs>> =>
    await prisma.order.aggregate(options),

  querySalesByDate: async (): Promise<PrismaSalesByDate[]> =>
    await prisma.$queryRaw`
      SELECT
        TO_CHAR("createdAt", 'YYYY/MM/DD') as date,
        SUM("totalPrice") as "totalSales"
      FROM "Order"
      GROUP BY date
      ORDER BY date ASC
    `,
};
