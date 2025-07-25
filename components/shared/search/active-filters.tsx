"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { X } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const ActiveFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const minRating = searchParams.get("minRating");
  const sortBy = searchParams.get("sortBy");

  const hasActiveFilters = category || minPrice || maxPrice || minRating || sortBy;

  const removeFilter = (filterKey: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete(filterKey);
    router.push(`/search?${params.toString()}`);
  };

  const removePriceFilter = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("minPrice");
    params.delete("maxPrice");
    router.push(`/search?${params.toString()}`);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);
    router.push(`/search?${params.toString()}`);
  };

  if (!hasActiveFilters) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-sm text-muted-foreground">Active filters:</span>

      {category && (
        <Badge variant="secondary" className="rounded-full flex items-center gap-1">
          Category: {category}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => removeFilter("category")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {(minPrice || maxPrice) && (
        <Badge variant="secondary" className="rounded-full flex items-center gap-1">
          Price: ${minPrice || "0"} - ${maxPrice || "∞"}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={removePriceFilter}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {minRating && (
        <Badge variant="secondary" className="rounded-full flex items-center gap-1">
          Rating: {minRating}+ stars
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => removeFilter("minRating")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {sortBy && (
        <Badge variant="secondary" className="rounded-full flex items-center gap-1">
          Sort:{" "}
          {sortBy === "newest"
            ? "Newest"
            : sortBy === "lowest"
            ? "Price: Low to High"
            : sortBy === "highest"
            ? "Price: High to Low"
            : "Rating"}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 hover:bg-transparent"
            onClick={() => removeFilter("sortBy")}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      <Button variant="outline" size="sm" onClick={clearAllFilters} className="ml-2">
        Clear All
      </Button>
    </div>
  );
};
