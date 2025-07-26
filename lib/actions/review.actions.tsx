"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { CreateReviewForm } from "@/types";
import { createReviewSchema } from "../validators";
import { ReviewService } from "../services/review.service";

export async function createReviewAction(productId: string, values: CreateReviewForm) {
  try {
    // Verify user is authenticated
    const session = await auth();
    if (!session) {
      throw new Error("You must be logged in to create a review");
    }

    // Validate input data
    const validatedFields = createReviewSchema.parse(values);

    //Check if user already reviewed this product
    const userId = session.user.id;
    const existingReview = await ReviewService.getByUserAndProduct(userId, productId);
    if (existingReview) {
      throw new Error("You have already reviewed this product");
    }

    // Create new review
    await ReviewService.create(userId, productId, validatedFields);

    // Revalidate product page to show new review
    revalidatePath(`/product/${productId}`);

    return { success: true, message: "Review posted successfuly" };
  } catch (error) {
    console.error("Error creating review:", error);
    return { success: false, message: "Error trying to post review" };
  }
}

export async function deleteReviewAction(reviewId: string) {
  try {
    // Verify user is authenticated
    const session = await auth();
    if (!session) {
      throw new Error("You must be logged in to delete a review");
    }

    // Delete review
    await ReviewService.delete(reviewId);

    // Revalidate product page to show new review
    revalidatePath(`/product`);

    return { success: true, message: "Review deleted successfuly" };
  } catch (error) {
    console.error("Error deleting review:", error);
    return { success: false, message: "Error trying to delete review" };
  }
}
