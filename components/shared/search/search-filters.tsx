"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { RatingFilter } from "@/components/shared/search/rating-filter";
import { CategoryFilter } from "@/components/shared/search/category-filter";
import { PriceFilter, priceRanges } from "@/components/shared/search/price-filter";

export const SearchFilters = ({ categories }: { categories: string[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");
  const [minRating, setMinRating] = useState<string>("");

  // Initialize filters from URL params
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "");
    const urlMinPrice = searchParams.get("minPrice") || "";
    const urlMaxPrice = searchParams.get("maxPrice") || "";
    setMinPrice(urlMinPrice);
    setMaxPrice(urlMaxPrice);
    setMinRating(searchParams.get("minRating") || "");

    // Determine selected price range based on URL params
    if (urlMinPrice || urlMaxPrice) {
      const matchingRange = priceRanges.find(
        (range) =>
          range.min?.toString() === urlMinPrice &&
          (range.max?.toString() === urlMaxPrice || (!range.max && !urlMaxPrice))
      );
      setSelectedPriceRange(matchingRange?.value || "custom");
    } else {
      setSelectedPriceRange("");
    }
  }, [searchParams]);

  const handlePriceRangeChange = (value: string) => {
    setSelectedPriceRange(value);

    if (value === "custom") {
      // Keep current custom values
      return;
    }

    const selectedRange = priceRanges.find((range) => range.value === value);
    if (selectedRange) {
      setMinPrice(selectedRange.min?.toString() || "");
      setMaxPrice(selectedRange.max?.toString() || "");
    }
  };

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams.toString());

    // Preserve search term
    const search = searchParams.get("search");
    if (search) params.set("search", search);

    // Update filters
    if (selectedCategory) {
      params.set("category", selectedCategory);
    } else {
      params.delete("category");
    }

    if (minPrice) {
      params.set("minPrice", minPrice);
    } else {
      params.delete("minPrice");
    }

    if (maxPrice) {
      params.set("maxPrice", maxPrice);
    } else {
      params.delete("maxPrice");
    }

    if (minRating) {
      params.set("minRating", minRating);
    } else {
      params.delete("minRating");
    }

    router.push(`/search?${params.toString()}`);
  };

  const clearFilters = () => {
    const params = new URLSearchParams();
    const search = searchParams.get("search");
    if (search) params.set("search", search);

    setSelectedCategory("");
    setSelectedPriceRange("");
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");

    router.push(`/search?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold">Filters</h3>

      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />

      <div className="flex flex-col sm:flex-row lg:flex-col gap-4">
        <PriceFilter
          selectedPriceRange={selectedPriceRange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onPriceRangeChange={handlePriceRangeChange}
          onMinPriceChange={setMinPrice}
          onMaxPriceChange={setMaxPrice}
        />

        <RatingFilter minRating={minRating} onRatingChange={setMinRating} />
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <Button onClick={updateFilters} className="w-full" size="sm">
          Apply Filters
        </Button>
        <Button onClick={clearFilters} variant="outline" className="w-full" size="sm">
          Clear All
        </Button>
      </div>
    </div>
  );
};
