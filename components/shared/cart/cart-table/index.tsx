"use client";

import Link from "next/link";
import Image from "next/image";

import { CartItem } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableQuantity from "./table-quantity";
import { ImageOff } from "lucide-react";

type CartTableProps = {
  cartItems: CartItem[];
};

const CartTable = ({ cartItems }: CartTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="">Item</TableHead>
          <TableHead className="text-center">Price</TableHead>
          <TableHead className="text-center">Quantity</TableHead>
          <TableHead className="text-right">Subtotal</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {cartItems.map((item) => (
          <TableRow key={item.productId}>
            <TableCell className="font-medium">
              <Link href={`/product/${item.slug}`} className="flex items-center gap-2">
                {item.image ? (
                  <Image
                    className="rounded-sm"
                    src={item.image}
                    alt={`${item.name} image`}
                    width={90}
                    height={150}
                  />
                ) : (
                  <ImageOff className="size-10 m-6 text-gray-400" />
                )}
                <p>{item.name}</p>
              </Link>
            </TableCell>
            <TableCell className="text-center">{item.price}</TableCell>
            <TableCell className="text-center">
              <TableQuantity item={item} stock={10} />
            </TableCell>
            <TableCell className="text-right">
              ${(Number(item.price) * item.quantity).toFixed(2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default CartTable;
