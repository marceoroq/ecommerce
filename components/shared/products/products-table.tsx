import { DeleteProductButton } from "@/components/shared/products/delete-product-button";
import { EditProductButton } from "@/components/shared/products/edit-product-button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Product } from "@/types";

type ProductsTableProps = {
  products: Product[];
};

export const ProductsTable = ({ products }: ProductsTableProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Price</TableHead>
          <TableHead>Category</TableHead>
          <TableHead className="text-center">Stock</TableHead>
          <TableHead className="text-center">Rating</TableHead>
          <TableHead className="text-center">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.id.slice(0, 7)}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>$ {product.price}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell className="text-center">{product.stock}</TableCell>
            <TableCell className="text-center">{product.rating}</TableCell>
            <TableCell className="flex gap-2 justify-center">
              <EditProductButton product={product} />
              <DeleteProductButton productId={product.id} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
