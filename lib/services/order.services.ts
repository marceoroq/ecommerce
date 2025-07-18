import "server-only";

import { UserService } from "@/lib/services/user.services";
import { CartService } from "@/lib/services/cart.services";
import { toPlainObject } from "@/lib/utils";
import { verifySession } from "@/lib/auth/verify-session";
import { OrderRepository } from "@/lib/data/order.repository";
import { insertOrderSchema } from "@/lib/validators";

import { Order, OrderItem } from "@/types";
import {
  Order as PrismaOrder,
  OrderItem as PrismaOrderItem,
} from "@/lib/generated/prisma";

function convertPrismaOrderItemToPOJO(
  orderItem: Omit<PrismaOrderItem, "orderId">
): OrderItem {
  return {
    ...toPlainObject(orderItem),
    price: orderItem.price.toFixed(2),
  };
}

function convertPrismaOrderToPOJO(
  order: PrismaOrder & { OrderItem: PrismaOrderItem[] }
): Order {
  const { OrderItem, ...restOrder } = order;
  return {
    ...toPlainObject(restOrder),
    taxPrice: order.taxPrice.toFixed(2),
    totalPrice: order.totalPrice.toFixed(2),
    itemsPrice: order.itemsPrice.toFixed(2),
    shippingPrice: order.shippingPrice.toFixed(2),
    items: OrderItem.map(convertPrismaOrderItemToPOJO),
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

  createOrder: async (): Promise<string> => {
    const { userId } = await verifySession();
    const user = await UserService.getUserById(userId);

    if (!user?.address) throw new Error("VALIDATION_CART_EMPTY");
    if (!user?.paymentMethod) throw new Error("VALIDATION_NO_PAYMENT_METHOD");

    const cart = await CartService.getCurrentCart();
    if (!cart || cart.items.length === 0)
      throw new Error("VALIDATION_CART_EMPTY");

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
};
