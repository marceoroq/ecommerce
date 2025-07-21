import Link from "next/link";
import dateFormat from "dateformat";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
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
              <TooltipProvider>
                <TableCell className="flex justify-center gap-2">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="size-6" variant="outline">
                        <Pencil />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Edit product</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button className="size-6" variant="destructive">
                        <Trash2 />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Delete product</TooltipContent>
                  </Tooltip>
                </TableCell>
              </TooltipProvider>
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
