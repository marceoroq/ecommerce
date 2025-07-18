"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

import { createOrderAction } from "@/lib/actions/order.actions";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";

export const CreateOrderButton = () => {
  const [response, formAction, isPending] = useActionState(
    createOrderAction,
    null
  );
  const router = useRouter();

  useEffect(() => {
    if (!response) return;

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    router.push(response.redirectTo || "/");
  }, [response, router]);

  return (
    <form action={formAction}>
      <Button
        type="submit"
        variant="default"
        disabled={isPending}
        className="w-full mt-2"
      >
        {isPending ? <Spinner /> : "Create Order"}
      </Button>
    </form>
  );
};
