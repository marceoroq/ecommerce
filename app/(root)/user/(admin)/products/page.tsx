import { ProductService } from "@/lib/services/product.services";

import { SearchInput } from "@/components/shared/search/search-input";
import { ProductsTable } from "@/components/shared/products/products-table";
import { CreateProductButton } from "@/components/shared/products/create-product-button";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchTerm = (await searchParams)?.search;
  const products = await ProductService.getProducts({ searchTerm });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-2xl self-start">Products</h3>
        <div className="flex gap-2">
          <SearchInput defaultValue={searchTerm} />
          <CreateProductButton />
        </div>
      </div>
      {products.length > 0 ? (
        <ProductsTable products={products} />
      ) : (
        <p className="text-gray-600">Looks quiet here… Time to create your first product!</p>
      )}
    </div>
  );
}
