"use client";

import { FaStar } from "react-icons/fa6";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RatingFilterProps {
  minRating: string;
  onRatingChange: (rating: string) => void;
}

export const RatingFilter = ({ minRating, onRatingChange }: RatingFilterProps) => {
  return (
    <Card className="flex-1">
      <CardHeader className="py-4">
        <CardTitle className="text-sm">Minimum Rating</CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <RadioGroup value={minRating} onValueChange={onRatingChange}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="" id="all-ratings" />
            <Label htmlFor="all-ratings" className="text-sm font-normal">
              All Ratings
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="rating-3" />
            <Label htmlFor="rating-3" className="text-sm flex items-center font-normal gap-1">
              <FaStar className="h-3 w-3 text-yellow-400" /> 3 & Up
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="4" id="rating-4" />
            <Label htmlFor="rating-4" className="text-sm flex items-center font-normal gap-1">
              <FaStar className="h-3 w-3 text-yellow-400" /> 4 & Up
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="5" id="rating-5" />
            <Label htmlFor="rating-5" className="text-sm flex items-center font-normal gap-1">
              <FaStar className="h-3 w-3 text-yellow-400" /> 5
            </Label>
          </div>
        </RadioGroup>
      </CardContent>
    </Card>
  );
};
