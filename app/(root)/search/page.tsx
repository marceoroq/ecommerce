import { ProductService } from "@/lib/services/product.services";

import ProductCard from "@/components/shared/product/product-card";

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ [key: string]: string | undefined }>;
}) {
  const searchTerm = (await searchParams)?.search || "";
  const products = await ProductService.getProducts(searchTerm);

  return (
    <div className="flex flex-col gap-6 py-6">
      <div className="flex items-center justify-between">
        <h1 className="h2-bold">Search Results</h1>
      </div>

      {searchTerm ? (
        <p className="text-muted-foreground">
          {products.length} results for &ldquo;{searchTerm}&rdquo;
        </p>
      ) : (
        <p className="text-muted-foreground">Browse all products</p>
      )}

      {products.length > 0 ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.slug} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-xl font-semibold">No products found</p>
          <p className="text-muted-foreground">Try searching with different keywords</p>
        </div>
      )}
    </div>
  );
}
