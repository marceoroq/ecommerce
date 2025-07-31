"use client";

import { useState, useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/shared/spinner";
import { keepNewCartAction } from "@/lib/actions/cart.actions";
import { toast } from "sonner";

export const CartFusionDialog = ({ show }: { show: boolean }) => {
  const [isOpen, setIsOpen] = useState(show);
  const [isPending, startTransition] = useTransition();

  const handleKeepPrevious = () => {
    setIsOpen(false);
  };

  const handleUseCurrent = () => {
    startTransition(async () => {
      const result = await keepNewCartAction();
      if (result.success) {
        setIsOpen(false);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className={cn("max-w-md w-full")}>
        <DialogHeader>
          <DialogTitle>Merge Cart</DialogTitle>
        </DialogHeader>
        <p className="mb-4">
          You have items in your previous cart. Would you like to keep them or use your current
          cart?
        </p>
        <div className="flex gap-4">
          <Button onClick={handleKeepPrevious} className="w-full" variant="secondary">
            Keep Previous
          </Button>
          <Button
            onClick={handleUseCurrent}
            className="w-full"
            variant="default"
            disabled={isPending}
          >
            {isPending ? <Spinner /> : "Use current"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
