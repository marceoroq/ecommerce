import { ProductService } from "@/lib/services/product.services";

import { SearchFilters } from "@/components/shared/search/search-filters";

interface SearchLayoutProps {
  children: React.ReactNode;
}

export default async function SearchLayout({ children }: SearchLayoutProps) {
  const categories = await ProductService.getAllCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Search Products</h1>
        <p className="text-muted-foreground">
          Find the perfect products with our advanced search and filtering options.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {/* Sidebar with filters */}
        <div className="lg:col-span-1">
          <div className="sticky top-4">
            <SearchFilters categories={categories} />
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-3 xl:col-span-4">{children}</div>
      </div>
    </div>
  );
}
