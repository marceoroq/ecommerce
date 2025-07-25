"use client";

import { FaStar } from "react-icons/fa6";

import { cn } from "@/lib/utils";

type ReviewRatingProps = {
  className?: string;
  rating: number;
  size?: "sm" | "md" | "lg";
};

export const ReviewRating = ({ className = "", rating, size = "md" }: ReviewRatingProps) => {
  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5",
  };

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[1, 2, 3, 4, 5].map((star) => (
        <FaStar
          key={star}
          className={cn(
            sizeClasses[size],
            star <= rating ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
          )}
        />
      ))}
    </div>
  );
};