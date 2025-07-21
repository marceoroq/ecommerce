import Link from "next/link";
import dateFormat from "dateformat";
import { Pencil } from "lucide-react";

import { DeleteOrderButton } from "@/components/shared/order/delete-order-button";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Order } from "@/types";

type OrderHistoryTableProps = {
  isAdmin: boolean;
  orderHistory: Order[];
};

export const OrderHistoryTable = ({ isAdmin, orderHistory }: OrderHistoryTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-center">Total</TableHead>
          <TableHead>Paid</TableHead>
          <TableHead>Delivered</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orderHistory.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">{order.id.slice(0, 7)}</TableCell>
            <TableCell>{dateFormat(order.createdAt)}</TableCell>
            <TableCell className="text-center">$ {order.totalPrice}</TableCell>
            <TableCell>{order.isPaid ? dateFormat(order.paidAt!) : "Not Paid"}</TableCell>
            <TableCell>
              {order.isDelivered ? dateFormat(order.deliveredAt!) : "Not Delivered"}
            </TableCell>
            {isAdmin ? (
              <TableCell className="flex justify-center gap-2">
                <Button className="size-6" variant="outline">
                  <Pencil />
                </Button>
                <DeleteOrderButton orderId={order.id} />
              </TableCell>
            ) : (
              <TableCell className="text-right">
                <Link href={`/order/${order.id}`}>Details</Link>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
