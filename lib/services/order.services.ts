import "server-only";

import { UserService } from "@/lib/services/user.services";
import { CartService } from "@/lib/services/cart.services";
import { verifySession } from "@/lib/auth/verify-session";
import { OrderRepository } from "@/lib/data/order.repository";

import prisma from "@/lib/prisma";
import { toPlainObject } from "@/lib/utils";
import { insertOrderSchema } from "@/lib/validators";
import { Order, OrderItem, PaypalResult } from "@/types";
import { Prisma, Order as PrismaOrder, OrderItem as PrismaOrderItem } from "@/lib/generated/prisma";

import { ORDERS_PAGE_SIZE } from "@/lib/constants";

function convertPrismaOrderItemToPOJO(orderItem: Omit<PrismaOrderItem, "orderId">): OrderItem {
  return {
    ...toPlainObject(orderItem),
    price: orderItem.price.toFixed(2),
  };
}

function convertPrismaOrderToPOJO(order: PrismaOrder & { OrderItem?: PrismaOrderItem[] }): Order {
  const { OrderItem, ...restOrder } = order;
  return {
    ...toPlainObject(restOrder),
    taxPrice: order.taxPrice.toFixed(2),
    totalPrice: order.totalPrice.toFixed(2),
    itemsPrice: order.itemsPrice.toFixed(2),
    shippingPrice: order.shippingPrice.toFixed(2),
    items: OrderItem?.map(convertPrismaOrderItemToPOJO) || [],
    paypalResult: JSON.parse(JSON.stringify(order.paypalResult)),
    shippingAddress: JSON.parse(JSON.stringify(order.shippingAddress)),
  };
}

export const OrderService = {
  getOrderById: async (id: string): Promise<Order | null> => {
    try {
      const order = await OrderRepository.findByIdWithDetails(id);

      if (!order) return null;

      return convertPrismaOrderToPOJO(order);
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  getOrdersByUserId: async ({
    userId,
    limit = ORDERS_PAGE_SIZE,
    page = 1,
  }: {
    userId: string;
    limit?: number;
    page?: number;
  }): Promise<{ data: Order[]; totalCount: number }> => {
    const [orders, totalCount] = await Promise.all([
      OrderRepository.findAll({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      OrderRepository.count({ where: { userId } }),
    ]);

    return {
      data: orders.map((order) => convertPrismaOrderToPOJO(order)),
      totalCount,
    };
  },

  createOrder: async (): Promise<string> => {
    const { userId } = await verifySession();
    const user = await UserService.getUserById(userId);

    if (!user?.address) throw new Error("VALIDATION_CART_EMPTY");
    if (!user?.paymentMethod) throw new Error("VALIDATION_NO_PAYMENT_METHOD");

    const cart = await CartService.getCurrentCart();
    if (!cart || cart.items.length === 0) throw new Error("VALIDATION_CART_EMPTY");

    const itemsPrice = (
      cart.items.reduce((acc: number, item) => {
        return acc + Number(item.price) * item.quantity;
      }, 0) || 0
    ).toFixed(2);

    const totalPrice = (
      Number(itemsPrice) +
      Number(cart.shippingPrice) +
      Number(cart.taxPrice)
    ).toFixed(2);

    // Create order object
    const order = insertOrderSchema.parse({
      userId: user.id,
      shippingAddress: user.address,
      paymentMethod: user.paymentMethod,
      itemsPrice,
      shippingPrice: cart.shippingPrice,
      taxPrice: cart.taxPrice,
      totalPrice,
      items: cart.items,
    });

    const createdOrderId = await OrderRepository.create(order, cart.id);
    if (!createdOrderId) throw new Error("ORDER_NOT_CREATED");

    return createdOrderId;
  },

  updateOrder: async (id: string, data: Prisma.OrderUpdateInput): Promise<PrismaOrder> =>
    await OrderRepository.update(id, data),

  updateOrderToPaid: async (id: string, paypalResult?: PaypalResult) => {
    const order = await OrderRepository.findByIdWithDetails(id);
    if (!order) throw new Error("Order not found");

    if (order.isPaid) throw new Error("Order is already paid");

    // Transaction to update order and account for product stock
    const updatedOrder = await prisma.$transaction(async (tx) => {
      // Iterate over products and update stock
      for (const item of order.OrderItem) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      // Set the order to paid
      const updatedOrderInTransaction = await tx.order.update({
        where: { id },
        data: {
          isPaid: true,
          paidAt: new Date(),
          paypalResult,
        },
        include: {
          OrderItem: true,
          user: { select: { name: true, email: true } },
        },
      });

      return updatedOrderInTransaction;
    });

    return updatedOrder;
  },
};
