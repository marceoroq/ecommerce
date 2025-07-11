import { toPlainObject } from "@/lib/utils";
import { Cart as PlainCart } from "@/types";
import { Cart as PrismaCart } from "@/lib/generated/prisma";

export function convertPrismaCartToPOJO(prismaCart: PrismaCart): PlainCart {
  return {
    ...toPlainObject(prismaCart),
    shippingPrice: prismaCart.shippingPrice.toFixed(2).toString(),
    taxPrice: prismaCart.taxPrice.toFixed(2).toString(),
    items: JSON.parse(JSON.stringify(prismaCart.items)),
  };
}
