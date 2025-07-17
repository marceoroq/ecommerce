import "server-only";

import prisma from "@/lib/prisma";
import { Cart as PrismaModel, Prisma } from "@/lib/generated/prisma";
import { Cart } from "@/types";
import { toPlainObject } from "@/lib/utils";
import { CartRepository } from "../data/cart.repository";
import { UserService } from "./user.services";
import { cache } from "react";

export function convertPrismaCartToPOJO(prismaCart: PrismaModel): Cart {
  return {
    ...toPlainObject(prismaCart),
    shippingPrice: prismaCart.shippingPrice.toFixed(2).toString(),
    taxPrice: prismaCart.taxPrice.toFixed(2).toString(),
    items: JSON.parse(JSON.stringify(prismaCart.items)),
  };
}

const getCurrentCart = cache(async (sessionCartId = "") => {
  const currentUserId = await UserService.getAuthenticatedUserId();

  if (!currentUserId && !sessionCartId) return null;

  const prismaCart = currentUserId
    ? await CartRepository.findByUserId(currentUserId)
    : await CartRepository.findBySessionCartId(sessionCartId);

  if (!prismaCart) return null;

  return convertPrismaCartToPOJO(prismaCart);
});

export const CartService = {
  getCurrentCart,

  getCartById: async (id: string): Promise<PrismaModel | null> =>
    await CartRepository.findById(id),

  getCartByUserId: async (userId: string): Promise<PrismaModel | null> =>
    await CartRepository.findByUserId(userId),

  getCartBySessionCartId: async (
    sessionCartId: string
  ): Promise<PrismaModel | null> =>
    await CartRepository.findBySessionCartId(sessionCartId),

  getCartItemQuantity: async (
    productId: string,
    sessionCartId?: string
  ): Promise<number> => {
    const cart = await getCurrentCart(sessionCartId);
    return (
      cart?.items.find((item) => item.productId === productId)?.quantity || 0
    );
  },

  hasCartItems: async (sessionCartId?: string): Promise<boolean> => {
    const cart = await getCurrentCart(sessionCartId);
    return Boolean(cart?.items.length);
  },

  createCart: async (data: Prisma.CartCreateInput): Promise<PrismaModel> => {
    const currentUserId = await UserService.getAuthenticatedUserId();

    return await CartRepository.create({
      ...data,
      user: currentUserId ? { connect: { id: currentUserId } } : {},
    });
  },

  updateCart: async (
    id: string,
    data: Prisma.CartUpdateInput
  ): Promise<PrismaModel> =>
    await prisma.cart.update({
      where: { id },
      data,
    }),
};
