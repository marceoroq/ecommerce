"use client";

import { toast } from "sonner";
import { Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { markOrderAsDelivered } from "@/lib/actions/order.actions";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";

export const MarkAsDeliveredButton = ({
  orderId,
  disabled,
}: {
  orderId: string;
  disabled: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleMarkAsDelivered = () => {
    startTransition(async () => {
      const response = await markOrderAsDelivered(orderId);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
      router.refresh();
    });
  };

  return (
    <Button
      className="min-w-36"
      variant="outline"
      disabled={disabled}
      onClick={handleMarkAsDelivered}
    >
      {isPending ? (
        <Spinner />
      ) : (
        <>
          <Truck />
          Mark as Delivered
        </>
      )}
    </Button>
  );
};
