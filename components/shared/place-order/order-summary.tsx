import Link from "next/link";
import Image from "next/image";
import { Edit2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { CartItem, ShippingAddress } from "@/types";

type OrderSummaryProps = {
  address: ShippingAddress;
  paymentMethod: string;
  cartItems: CartItem[];
};

const OrderSummary = ({
  address,
  paymentMethod,
  cartItems,
}: OrderSummaryProps) => {
  return (
    <>
      <Card>
        <CardContent className="p-4 gap-4">
          <div className="flex justify-between">
            <h2 className="text-xl pb-4 font-medium">Shipping Address</h2>
            <Button asChild variant="outline">
              <Link href="/shipping-address">
                <Edit2 className="size-10" />
                Edit
              </Link>
            </Button>
          </div>
          <p className="text-sm">{address.fullName}</p>
          <p className="text-sm">
            {address.streetAddress}, {address.city}
          </p>
          <p className="text-sm">
            {address.postalCode}, {address.country}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 gap-4">
          <div className="flex justify-between">
            <h2 className="text-xl pb-4 font-medium">Payment Method</h2>
            <Button asChild variant="outline">
              <Link href="/payment-method">
                <Edit2 className="size-10" />
                Edit
              </Link>
            </Button>
          </div>
          <p className="capitalize text-sm">{paymentMethod}</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4 gap-4">
          <div className="flex justify-between">
            <h2 className="text-xl pb-4 font-medium">Order Items</h2>
            <Button asChild variant="outline">
              <Link href="/cart">
                <Edit2 className="size-10" />
                Edit
              </Link>
            </Button>
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
              {cartItems.map((item) => (
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
    </>
  );
};

export default OrderSummary;
