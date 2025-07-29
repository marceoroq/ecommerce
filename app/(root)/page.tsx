import { Suspense } from "react";

import { ProductList } from "@/components/shared/product/product-list";
import { FeaturedProducts } from "@/components/shared/product/featured-products";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FeaturesApp } from "@/components/shared/home/features-app";

export default async function HomePage() {
  return (
    <div className="p-2 flex flex-col w-full gap-2 items-center">
      <Suspense
        fallback={<Skeleton className="w-full h-64 md:h-80 animate-pulse bg-gray-200 rounded-xl" />}
      >
        <FeaturedProducts />
      </Suspense>

      <div className="flex flex-col w-full justify-center items-center gap-4 my-10">
        <h2 className="h2-bold mb-4">Newest Arribals</h2>
        <Suspense
          fallback={
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <Skeleton className="animate-pulse bg-gray-200 rounded-xl h-96" />
              <Skeleton className="animate-pulse bg-gray-200 rounded-xl h-96" />
              <Skeleton className="animate-pulse bg-gray-200 rounded-xl h-96" />
              <Skeleton className="animate-pulse bg-gray-200 rounded-xl h-96" />
            </div>
          }
        >
          <ProductList />
        </Suspense>
        <Button asChild>
          <Link href="/search">See All Products</Link>
        </Button>
        <FeaturesApp />
      </div>
    </div>
  );
}
