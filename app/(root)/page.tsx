import ProductList from "@/components/shared/product/product-list";
import { Suspense } from "react";

export default async function HomePage() {
  return (
    <div className="p-2 flex flex-col w-full gap-2 items-center">
      <div className="w-full my-10">
        <h2 className="h2-bold mb-4">Newest Arribals</h2>
        <Suspense
          fallback={
            <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              <div className="animate-pulse bg-gray-200 rounded-xl h-96"></div>
              <div className="animate-pulse bg-gray-200 rounded-xl h-96"></div>
              <div className="animate-pulse bg-gray-200 rounded-xl h-96"></div>
              <div className="animate-pulse bg-gray-200 rounded-xl h-96"></div>
            </div>
          }
        >
          <ProductList />
        </Suspense>
      </div>
    </div>
  );
}
