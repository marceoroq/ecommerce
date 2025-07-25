"use client";

import { FaStar } from "react-icons/fa";
import { Control } from "react-hook-form";
import { useState } from "react";

import { cn } from "@/lib/utils";

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";

import { CreateReviewForm } from "@/types";

interface ReviewRatingFormFieldProps {
  control: Control<CreateReviewForm>;
  className?: string;
}

export const ReviewRatingFormField = ({ control, className }: ReviewRatingFormFieldProps) => {
  const [hoveredStar, setHoveredStar] = useState<number>(0);

  return (
    <div className={cn("", className)}>
      <FormField
        control={control}
        name="rating"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Rating</FormLabel>
            <FormControl>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const isActive = star <= field.value;
                  const isHovered = hoveredStar > 0 && star <= hoveredStar;

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => field.onChange(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      className={`text-2xl transition-colors ${
                        isActive || isHovered
                          ? "text-yellow-400"
                          : "text-gray-300 hover:text-yellow-200"
                      }`}
                    >
                      <FaStar />
                    </button>
                  );
                })}
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
