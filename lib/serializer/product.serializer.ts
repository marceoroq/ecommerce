import { toPlainObject } from "@/lib/utils";
import { Product as PrismaProduct } from "@/lib/generated/prisma";
import { Product as PlainProduct } from "@/types";

/**
 * These serializations are performed because the objects returned by Prisma use the Decimal
 * data types that we define in our schema. That doesn't exist in JavaScript, so we have to 
 * transform them into some JS primitive. To maintain precision, Decimals are transformed to 
 * strings (in the case of rating, since precision is not as important, we pass it directly to
 * a number) besides, we remove other properties, methods and functions by making a more generic 
 * serialization with toPlainObject.
 */
export function convertPrismaProductToPOJO(prismaProduct: PrismaProduct): PlainProduct {
  return {
    ...toPlainObject(prismaProduct),
    price: prismaProduct.price.toString(),
    rating: prismaProduct.price.toNumber(),
  }
} 

export function convertPrismaProductsToPOJO(prismaProducts: PrismaProduct[]): PlainProduct[] {
  return prismaProducts.map(convertPrismaProductToPOJO)
} 
