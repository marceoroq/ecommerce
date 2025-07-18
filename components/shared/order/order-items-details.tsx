import Link from "next/link";
import Image from "next/image";

import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableRow,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
} from "@/components/ui/table";
import { CartItem } from "@/types";

type OrderItemsDetailsProps = {
  children?: React.ReactNode;
  orderItems: CartItem[];
};

export const OrderItemsDetails = ({
  children,
  orderItems,
}: OrderItemsDetailsProps) => {
  return (
    <Card>
      <CardContent className="p-4 gap-4">
        <div className="flex justify-between">
          <h2 className="text-xl pb-4 font-medium">Order Items</h2>
          {children}
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead className="text-center">Quantity</TableHead>
              <TableHead className="text-end">Subtotal</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems.map((item) => (
              <TableRow key={item.slug}>
                <TableCell>
                  <Link
                    href={`/product/${item.slug}`}
                    className="flex gap-2 items-center"
                  >
                    <Image
                      className="rounded-sm"
                      src={item.image}
                      alt={`${item.name} image`}
                      width={50}
                      height={50}
                    />
                    <span className="px-2">{item.name}</span>
                  </Link>
                </TableCell>
                <TableCell className="text-center">
                  <p>{item.quantity}</p>
                </TableCell>
                <TableCell className="text-end">
                  <p>$ {(Number(item.price) * item.quantity).toFixed(2)}</p>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
