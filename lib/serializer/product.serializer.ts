import { toPlainObject } from "@/lib/utils";
import { Product as PrismaProduct } from "@/lib/generated/prisma";
import { Product as PlainProduct } from "@/types";

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
