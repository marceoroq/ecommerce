"use client";

import { toast } from "sonner";
import { HandCoins } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { markOrderAsPaid } from "@/lib/actions/order.actions";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";

export const MarkAsPaidButton = ({ orderId, disabled }: { orderId: string; disabled: boolean }) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleMarkAsPaid = () => {
    startTransition(async () => {
      const response = await markOrderAsPaid(orderId);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    });
  };

  return (
    <Button className="min-w-36" variant="outline" disabled={disabled} onClick={handleMarkAsPaid}>
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <HandCoins />
          Mark as Paid
        </>
      )}
    </Button>
  );
};
