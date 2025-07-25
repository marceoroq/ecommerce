"use client";

import { useState } from "react";
import { User } from "lucide-react";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ReviewCard } from "@/components/shared/reviews/review-card";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Review } from "@/types";

// Mock data for reviews
const mockReviews: (Review & { user: { name: string; image?: string } })[] = [
  {
    id: "1",
    rating: 5,
    title: "Excellent product!",
    comment: "This product exceeded my expectations. Great quality and fast delivery.",
    userId: "user-1",
    productId: "product-1",
    createdAt: new Date("2025-07-15"),
    updatedAt: new Date("2025-07-15"),
    user: { name: "John Doe", image: "/images/user1.jpg" },
  },
  {
    id: "2",
    rating: 4,
    title: "Good value for money",
    comment: "Nice product, good quality. Delivery was a bit slow but overall satisfied.",
    userId: "user-2",
    productId: "product-1",
    createdAt: new Date("2025-07-10"),
    updatedAt: new Date("2025-07-10"),
    user: { name: "Jane Smith" },
  },
  {
    id: "3",
    rating: 3,
    title: "Average product",
    comment: "It's okay, nothing special. Does what it's supposed to do.",
    userId: "user-3",
    productId: "product-1",
    createdAt: new Date("2025-05-08"),
    updatedAt: new Date("2025-05-08"),
    user: { name: "Mike Johnson" },
  },
  {
    id: "4",
    rating: 5,
    title: "Amazing quality!",
    comment: "Best purchase I've made this year. Highly recommend to everyone!",
    userId: "user-4",
    productId: "product-1",
    createdAt: new Date("2025-01-05"),
    updatedAt: new Date("2025-01-05"),
    user: { name: "Sarah Wilson" },
  },
  {
    id: "5",
    rating: 2,
    title: "Not what I expected",
    comment: "The product quality is below average. Would not recommend.",
    userId: "user-5",
    productId: "product-1",
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-03"),
    user: { name: "Tom Brown" },
  },
  {
    id: "6",
    rating: 4,
    title: "Pretty good",
    comment: "Good product overall. Some minor issues but nothing major.",
    userId: "user-6",
    productId: "product-1",
    createdAt: new Date("2024-01-01"),
    updatedAt: new Date("2024-01-01"),
    user: { name: "Lisa Davis" },
  },
  {
    id: "7",
    rating: 5,
    title: "Perfect!",
    comment: "Exactly what I was looking for. Fast shipping and great customer service.",
    userId: "user-7",
    productId: "product-1",
    createdAt: new Date("2023-12-28"),
    updatedAt: new Date("2023-12-28"),
    user: { name: "David Miller" },
  },
  {
    id: "8",
    rating: 3,
    title: "Decent product",
    comment: "It's fine for the price. Nothing extraordinary but does the job.",
    userId: "user-8",
    productId: "product-1",
    createdAt: new Date("2023-12-25"),
    updatedAt: new Date("2023-12-25"),
    user: { name: "Emma Garcia" },
  },
];

type ReviewListProps = {
  className?: string;
  currentUserId?: string;
  isAdmin?: boolean;
  isAuthenticated?: boolean;
};

const REVIEWS_PER_PAGE = 5;

export const ReviewList = ({
  className = "",
  currentUserId,
  isAdmin = false,
  isAuthenticated = false,
}: ReviewListProps) => {
  const [visibleReviews, setVisibleReviews] = useState(REVIEWS_PER_PAGE);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);

  // Sort reviews: current user's review first, then by date
  const sortedReviews = mockReviews.sort((a, b) => {
    if (currentUserId) {
      if (a.userId === currentUserId && b.userId !== currentUserId) return -1;
      if (a.userId !== currentUserId && b.userId === currentUserId) return 1;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const displayedReviews = sortedReviews.slice(0, visibleReviews);
  const hasMoreReviews = visibleReviews < sortedReviews.length;
  const userHasReview =
    currentUserId && sortedReviews.some((review) => review.userId === currentUserId);

  const handleLoadMore = () => {
    setVisibleReviews((prev) => Math.min(prev + REVIEWS_PER_PAGE, sortedReviews.length));
  };

  const handleDeleteClick = (reviewId: string) => {
    setReviewToDelete(reviewId);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // Here you would call the delete API
    console.log(`Deleting review: ${reviewToDelete}`);
    setDeleteDialogOpen(false);
    setReviewToDelete(null);
  };

  return (
    <div className={cn("gap-4 flex flex-col", className)}>
      <div className="flex items-center gap-2">
        <h3 className="text-2xl font-bold">Customer Reviews</h3>
        <Badge variant="secondary" className="text-sm">
          {sortedReviews.length} {sortedReviews.length === 1 ? "review" : "reviews"}
        </Badge>
      </div>

      {!isAuthenticated && (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-8">
            <div className="text-center flex flex-col gap-2">
              <User className="h-8 w-8 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground">
                Please sign in to add a review for this product
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {isAuthenticated && !userHasReview && (
        <Card className="border-dashed">
          <CardContent className="flex items-center justify-center py-6">
            <div className="text-center flex flex-col gap-2">
              <p className="text-muted-foreground">You haven&apos;t reviewed this product yet</p>
              <Button variant="outline" size="sm">
                Write a Review
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {sortedReviews.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center flex flex-col gap-2">
              <p className="text-muted-foreground text-lg">No reviews yet</p>
              <p className="text-sm text-muted-foreground">Be the first to review this product!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {displayedReviews.map((review) => (
            <ReviewCard
              key={review.id}
              review={review}
              currentUserId={currentUserId}
              isAdmin={isAdmin}
              onDelete={handleDeleteClick}
            />
          ))}

          {hasMoreReviews && (
            <div className="flex justify-center pt-4">
              <Button variant="outline" onClick={handleLoadMore} className="min-w-[200px]">
                Load More Reviews ({sortedReviews.length - visibleReviews} remaining)
              </Button>
            </div>
          )}
        </div>
      )}

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Review</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              Delete Review
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
