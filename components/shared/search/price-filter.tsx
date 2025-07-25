"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const priceRanges = [
  { label: "All Prices", value: "", min: undefined, max: undefined },
  { label: "$1 - $50", value: "1-50", min: 1, max: 50 },
  { label: "$51 - $100", value: "51-100", min: 51, max: 100 },
  { label: "$101 - $200", value: "101-200", min: 101, max: 200 },
  { label: "$201 - $500", value: "201-500", min: 201, max: 500 },
  { label: "$500+", value: "500+", min: 500, max: undefined },
  { label: "Custom Range", value: "custom", min: undefined, max: undefined },
];

interface PriceFilterProps {
  selectedPriceRange: string;
  minPrice: string;
  maxPrice: string;
  onPriceRangeChange: (value: string) => void;
  onMinPriceChange: (value: string) => void;
  onMaxPriceChange: (value: string) => void;
}

export const PriceFilter = ({
  selectedPriceRange,
  minPrice,
  maxPrice,
  onPriceRangeChange,
  onMinPriceChange,
  onMaxPriceChange,
}: PriceFilterProps) => {
  return (
    <Card className="flex-1">
      <CardHeader className="py-4">
        <CardTitle className="text-sm">Price Range</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <RadioGroup value={selectedPriceRange} onValueChange={onPriceRangeChange}>
          {priceRanges.map((range) => (
            <div key={range.value} className="flex items-center space-x-2">
              <RadioGroupItem value={range.value} id={`price-${range.value}`} />
              <Label htmlFor={`price-${range.value}`} className="text-sm font-normal">
                {range.label}
              </Label>
            </div>
          ))}
        </RadioGroup>

        {selectedPriceRange === "custom" && (
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="minPrice" className="text-xs text-muted-foreground font-normal">
                Min Price
              </Label>
              <Input
                id="minPrice"
                type="number"
                placeholder="0"
                value={minPrice}
                onChange={(e) => onMinPriceChange(e.target.value)}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="maxPrice" className="text-xs text-muted-foreground font-normal">
                Max Price
              </Label>
              <Input
                id="maxPrice"
                type="number"
                placeholder="1000"
                value={maxPrice}
                onChange={(e) => onMaxPriceChange(e.target.value)}
                className="h-8"
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
