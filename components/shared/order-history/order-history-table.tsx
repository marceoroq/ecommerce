import Link from "next/link";
import dateFormat from "dateformat";
import { Pencil } from "lucide-react";

import { DeleteOrderButton } from "@/components/shared/order-history/delete-order-button";
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
            <TableCell>{dateFormat(order.createdAt, "mmm dd, yyyy HH:MM")}</TableCell>
            <TableCell className="text-center">$ {order.totalPrice}</TableCell>
            <TableCell>
              {order.isPaid ? dateFormat(order.paidAt!, "mmm dd, yyyy HH:MM") : "Not Paid"}
            </TableCell>
            <TableCell>
              {order.isDelivered
                ? dateFormat(order.deliveredAt!, "mmm dd, yyyy HH:MM")
                : "Not Delivered"}
            </TableCell>
            {isAdmin ? (
              <TableCell>
                <div className="flex justify-center gap-2">
                  <Button asChild className="size-6" variant="outline">
                    <Link href={`/order/${order.id}`}>
                      <Pencil />
                    </Link>
                  </Button>
                  <DeleteOrderButton orderId={order.id} />
                </div>
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
