"use client";

import { User } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { cn } from "@/lib/utils";
import { REVIEWS_PER_PAGE } from "@/lib/constants";
import { deleteReviewAction } from "@/lib/actions/review.actions";

import { Card, CardContent } from "@/components/ui/card";
import { ReviewCreateForm } from "@/components/shared/reviews/review-create-form";
import { ReviewCard } from "@/components/shared/reviews/review-card";
import { Spinner } from "@/components/shared/spinner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Review } from "@/types";

type ReviewListProps = {
  className?: string;
  productId: string;
  reviews: Review[];
  currentUserId?: string;
  isAdmin?: boolean;
  isAuthenticated?: boolean;
};

export const ReviewList = ({
  className = "",
  reviews,
  productId,
  currentUserId,
  isAdmin = false,
  isAuthenticated = false,
}: ReviewListProps) => {
  const [visibleReviews, setVisibleReviews] = useState(REVIEWS_PER_PAGE);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Sort reviews: current user's review first, then by date
  const sortedReviews = reviews.sort((a, b) => {
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
    startTransition(async () => {
      if (!reviewToDelete) return;

      const response = await deleteReviewAction(reviewToDelete);
      if (!response.success) {
        toast.error(response.message);
      }

      toast.success(response.message);
      setDeleteDialogOpen(false);
      setReviewToDelete(null);

      router.refresh();
    });
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
            <ReviewCreateForm productId={productId} />
          </CardContent>
        </Card>
      )}

      {sortedReviews.length === 0 ? (
        <div className="flex items-center justify-center py-10">
          <div className="text-center flex flex-col gap-2">
            <p className="text-muted-foreground text-lg">No reviews yet</p>
            <p className="text-sm text-muted-foreground">Be the first to review this product!</p>
          </div>
        </div>
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
            <Button variant="destructive" onClick={handleDeleteConfirm} disabled={isPending}>
              {isPending ? <Spinner /> : "Delete Review"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
