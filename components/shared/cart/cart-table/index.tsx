"use client";

import Link from "next/link";
import Image from "next/image";

import { CartItem } from "@/types";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableQuantity from "./table-quantity";

type CartTableProps = {
  cartItems: CartItem[];
};

const CartTable = ({ cartItems }: CartTableProps) => {
  const total = cartItems.reduce((acc, item) => {
    return acc + Number(item.price) * item.quantity;
  }, 0);

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
              <Link
                href={`/product/${item.slug}`}
                className="flex items-center"
              >
                <Image
                  className="rounded-sm"
                  src={item.image}
                  alt={`${item.name} image`}
                  width={90}
                  height={150}
                />
                {item.name}
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
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">${total}</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default CartTable;
