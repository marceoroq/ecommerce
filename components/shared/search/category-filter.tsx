"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CategoryFilterProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export const CategoryFilter = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) => {
  return (
    <Card>
      <CardHeader className="py-4">
        <CardTitle className="text-sm">Category</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <RadioGroup value={selectedCategory} onValueChange={onCategoryChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="all-categories" />
            <Label htmlFor="all-categories" className="text-sm font-normal">
              All Categories
            </Label>
          </div>
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <RadioGroupItem value={category} id={category} />
              <Label htmlFor={category} className="text-sm font-normal">
                {category}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
