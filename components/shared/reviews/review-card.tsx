"use client";

import { Trash2 } from "lucide-react";
import { FaStar } from "react-icons/fa6";
import { formatDistanceToNow } from "date-fns";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Review } from "@/types";

type ReviewCardProps = {
  className?: string;
  review: Review & { user: { name: string; image?: string } };
  currentUserId?: string;
  isAdmin?: boolean;
  onDelete: (reviewId: string) => void;
};

export const ReviewCard = ({
  className = "",
  review,
  currentUserId,
  isAdmin = false,
  onDelete,
}: ReviewCardProps) => {
  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={cn(
              "h-4 w-4",
              star <= rating ? "text-yellow-400 fill-current" : "text-gray-300 dark:text-gray-600"
            )}
          />
        ))}
      </div>
    );
  };

  const canDeleteReview = () => {
    return isAdmin || (currentUserId && review.userId === currentUserId);
  };

  const isCurrentUserReview = currentUserId === review.userId;

  return (
    <Card
      className={cn(
        "transition-all duration-200 hover:shadow-md",
        isCurrentUserReview && "ring-2 ring-primary/20 bg-primary/5",
        className
      )}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={review.user.image} alt={review.user.name} />
              <AvatarFallback>
                {review.user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{review.user.name}</p>
                {isCurrentUserReview && (
                  <Badge variant="outline" className="text-xs px-2 py-0">
                    Your Review
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-2">
                {renderStars(review.rating)}
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(review.createdAt, { addSuffix: true })}
                </span>
              </div>
            </div>
          </div>
          {canDeleteReview() && (
            <Button
              variant="outline"
              onClick={() => onDelete(review.id)}
              className="text-destructive hover:text-destructive hover:border-destructive hover:bg-destructive/10 dark:text-red-400 dark:hover:text-red-300 dark:hover:border-red-400 dark:hover:bg-red-400/10"
            >
              <Trash2 className="h-4 w-4" /> Delete
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-col gap-2">
          <h4 className="font-medium text-base">{review.title}</h4>
          <p className="text-muted-foreground leading-relaxed">{review.comment}</p>
        </div>
      </CardContent>
    </Card>
  );
};
