import { ProductService } from "@/lib/services/product.services";

import { ProductCard } from "@/components/shared/product/product-card";
import { SortSelector } from "@/components/shared/search/sort-selector";
import { ActiveFilters } from "@/components/shared/search/active-filters";

export const metadata = {
  title: "Search Products",
  description: "Find the perfect products with our advanced search and filtering options.",
  keywords: ["search", "products", "ecommerce", "filter", "shopping"]
};

type SortOptions = "newest" | "lowest" | "highest" | "rating";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await searchParams;
  const { search, category, minPrice, maxPrice, minRating, sortBy } = params;

  // Convert string params to appropriate types
  const filters = {
    searchTerm: search,
    category,
    minPrice: minPrice ? parseFloat(minPrice) : undefined,
    maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
    minRating: minRating ? parseFloat(minRating) : undefined,
    sortBy: sortBy as SortOptions,
  };

  const products = await ProductService.getProducts(filters);

  return (
    <div className="space-y-6">
      {/* Header with active filters and sort selector */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b">
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            {search ? `Results for "${search}"` : "All Products"}
          </h2>
          <p className="text-muted-foreground">
            {products.length} {products.length === 1 ? "product" : "products"} found
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <SortSelector />
        </div>
      </div>

      <ActiveFilters />

      {/* Products grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-2xl font-semibold text-muted-foreground">No products found</h3>
          <p className="text-muted-foreground mt-2">
            {search || category || minPrice || maxPrice || minRating
              ? "Try adjusting your search criteria or filters"
              : "No products are available at the moment"}
          </p>
        </div>
      )}
    </div>
  );
}
