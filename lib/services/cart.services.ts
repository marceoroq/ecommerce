import "server-only";

import { cache } from "react";

import prisma from "@/lib/prisma";
import { UserService } from "@/lib/services/user.services";
import { CartRepository } from "@/lib/data/cart.repository";

import { Cart } from "@/types";
import { Cart as PrismaModel, Prisma } from "@/lib/generated/prisma";
import { toPlainObject } from "@/lib/utils";

export function convertPrismaCartToPOJO(prismaCart: PrismaModel): Cart {
  return {
    ...toPlainObject(prismaCart),
    shippingPrice: prismaCart.shippingPrice.toFixed(2).toString(),
    taxPrice: prismaCart.taxPrice.toFixed(2).toString(),
    items: JSON.parse(JSON.stringify(prismaCart.items)),
  };
}

const getCartById = async (id: string): Promise<PrismaModel | null> =>
  await CartRepository.findById(id);

const getCurrentCart = cache(async (sessionCartId = "") => {
  const currentUserId = await UserService.getAuthenticatedUserId();

  if (!currentUserId && !sessionCartId) return null;

  const prismaCart = currentUserId
    ? await CartRepository.findByUserId(currentUserId)
    : await CartRepository.findBySessionCartId(sessionCartId);

  if (!prismaCart) return null;

  return convertPrismaCartToPOJO(prismaCart);
});

const getCartByUserId = async (userId: string): Promise<PrismaModel | null> =>
  await CartRepository.findByUserId(userId);

const getCartBySessionCartId = async (sessionCartId: string): Promise<PrismaModel | null> =>
  await CartRepository.findBySessionCartId(sessionCartId);

const getCartItemQuantity = async (productId: string, sessionCartId?: string): Promise<number> => {
  const cart = await getCurrentCart(sessionCartId);
  return cart?.items.find((item) => item.productId === productId)?.quantity || 0;
};

const hasCartItems = async (sessionCartId?: string): Promise<boolean> => {
  const cart = await getCurrentCart(sessionCartId);
  return Boolean(cart?.items.length);
};

const hasCartConflict = async (sessionCartId: string): Promise<boolean> => {
  const guestCart = await getCartBySessionCartId(sessionCartId);
  if (!guestCart || guestCart.items.length === 0) return false;

  const userCart = await getCurrentCart();
  if (!userCart || userCart.items.length === 0) return false;

  if (guestCart?.id === userCart?.id) {
    // si el usuario al loguearse no tenia un carrito con productos y se le asocio
    // el carrito guest a traves de la funcion associatedGuestCart, entonces el id
    // de guestCart y userCart van a ser el mismo, por lo tanto no hay conflicto.
    return false;
  }

  return true;
};

const createCart = async (data: Prisma.CartCreateInput): Promise<PrismaModel> => {
  const currentUserId = await UserService.getAuthenticatedUserId();

  return await CartRepository.create({
    ...data,
    user: currentUserId ? { connect: { id: currentUserId } } : {},
  });
};

const keepNewCart = async ({
  previousCartId,
  sessionCartId,
  userId,
}: {
  previousCartId: string;
  sessionCartId: string;
  userId: string;
}) => {
  await prisma.$transaction(async (tx) => {
    const newCart = await tx.cart.findFirst({
      where: { sessionCartId },
    });

    if (!newCart) throw new Error("New cart not found with sessionCartId");

    await tx.cart.delete({
      where: { id: previousCartId },
    });

    await tx.cart.update({
      where: { id: newCart.id },
      data: {
        user: { connect: { id: userId } },
      },
    });
  });
};

// This function is only for associating the guest cart to the user when they log in,
// as long as the user didn't already have a cart with associated products
const associateGuestCart = async (sessionCartId: string, userId: string) => {
  // First we check if a guest cart exists and if it exists, if it has products
  const guestCart = await CartService.getCartBySessionCartId(sessionCartId);
  if (!guestCart || guestCart.items.length === 0) return null;

  const prevCart = await CartService.getCartByUserId(userId);
  if (prevCart && prevCart.items.length > 0) {
    // If the user has a cart with products, we won't associate the guest cart to the user,
    // and we'll continue with the application flow, since in this case our application will
    // show a modal to the client to decide whether to preserve their existing cart or replace
    // it with the guest cart.
    return null;
  }

  // If the user had a cart but it didn't have items, we delete it.
  if (prevCart) await CartService.deleteCart(prevCart?.id);

  // finally we associate the guest cart to the user
  await CartRepository.update(guestCart.id, {
    user: { connect: { id: userId } },
  });
};

const updateCart = async (id: string, data: Prisma.CartUpdateInput): Promise<PrismaModel> =>
  await CartRepository.update(id, data);

const deleteCart = async (id: string): Promise<PrismaModel> => await CartRepository.delete(id);

export const CartService = {
  getCartBySessionCartId,
  getCartItemQuantity,
  associateGuestCart,
  getCartByUserId,
  hasCartConflict,
  getCurrentCart,
  hasCartItems,
  keepNewCart,
  getCartById,
  createCart,
  updateCart,
  deleteCart,
};
