"use client";

import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";

import { cn } from "@/lib/utils";
import { createReviewAction } from "@/lib/actions/review.actions";

import { ReviewRatingFormField } from "@/components/shared/reviews/review-rating-form-field";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { CreateReviewForm } from "@/types";
import { createReviewSchema } from "@/lib/validators";

interface ReviewCreateFormProps {
  productId: string;
}

export const ReviewCreateForm = ({
  productId,
  className,
}: ReviewCreateFormProps & { className?: string }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CreateReviewForm>({
    resolver: zodResolver(createReviewSchema),
    defaultValues: {
      title: "",
      comment: "",
      rating: 0,
    },
  });

  const onSubmit = (data: CreateReviewForm) => {
    startTransition(async () => {
      const response = await createReviewAction(productId, data);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    });
  };

  return (
    <div className={cn("w-full", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter review title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commet</FormLabel>
                <FormControl>
                  <Textarea placeholder="Write your review" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <ReviewRatingFormField control={form.control} />

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating..." : "Create Review"}
          </Button>
        </form>
      </Form>
    </div>
  );
};
