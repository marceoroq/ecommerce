import Link from "next/link";
import dateFormat from "dateformat";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Order } from "@/types";

export const OrderHistoryTable = ({ orderHistory }: { orderHistory: Order[] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Created</TableHead>
          <TableHead className="text-center">Total</TableHead>
          <TableHead>Paid</TableHead>
          <TableHead>Delivered</TableHead>
          <TableHead className="text-right">Actions</TableHead>
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
            <TableCell className="text-right">
              <Link href={`/order/${order.id}`}>Details</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
