import Link from "next/link";
import dateFormat from "dateformat";

import type { OrderWithName } from "@/lib/data/order.repository";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type LastSalesTableProps = {
  lastSales: OrderWithName[];
};

export const LastSalesTable = ({ lastSales }: LastSalesTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Buyer</TableHead>
          <TableHead>Date</TableHead>
          <TableHead className="text-center">Total</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody className="font-normal">
        {lastSales.map((sale) => (
          <TableRow key={sale.id}>
            <TableCell className="font-medium">{sale.user.name}</TableCell>
            <TableCell>{dateFormat(sale.createdAt)}</TableCell>
            <TableCell className="text-center">$ {String(sale.totalPrice)}</TableCell>
            <TableCell className="text-right">
              <Link href={`/order/${sale.id}`}>Details</Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
