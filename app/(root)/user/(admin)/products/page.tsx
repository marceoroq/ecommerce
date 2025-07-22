import { ProductsTable } from "@/components/shared/products/products-table";
import { ProductService } from "@/lib/services/product.services";

export default async function ProductsPage() {
  const products = await ProductService.getProducts();

  return (
    <div className="flex flex-col gap-4">
      <h3 className="font-semibold text-2xl">Products</h3>
      {products.length > 0 ? (
        <ProductsTable products={products} />
      ) : (
        <p className="text-gray-600">Looks quiet here… Time to create your first product!</p>
      )}
    </div>
  );
}
