"use client";

import { cn } from "@/lib/utils";
import { Minus, Plus, Trash } from "lucide-react";
import { Spinner } from "@/components/shared/spinner";

interface QuantityInputProps {
  quantity: number;
  min?: number;
  max?: number | null;
  withBorders?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  onIncrease: VoidFunction;
  onDecrease: VoidFunction;
  className?: string;
}

const QuantityInput = ({
  className,
  disabled = false,
  isLoading = false,
  withBorders = true,
  max = null,
  min = 0,
  onIncrease,
  onDecrease,
  quantity,
}: QuantityInputProps) => {
  const handleDecrease = () => {
    onDecrease();
  };

  const handleIncrease = () => {
    onIncrease();
  };

  return (
    <div
      className={cn(
        "inline-flex rounded-lg shadow-xs shadow-black/5",
        className
      )}
    >
      <button
        className={cn(
          "hover:bg-muted-foreground/10 flex cursor-pointer items-center justify-center rounded-s-lg border px-3 py-1 focus-visible:z-10 disabled:cursor-not-allowed disabled:opacity-50",
          disabled && "pointer-events-none"
        )}
        onClick={handleDecrease}
        disabled={disabled || isLoading || quantity <= min}
        aria-label="Decrease quantity"
      >
        {quantity === 1 ? (
          <Trash size={16} strokeWidth={2} aria-hidden="true" />
        ) : (
          <Minus size={16} strokeWidth={2} aria-hidden="true" />
        )}
      </button>
      <p
        className={cn(
          "w-full px-2 py-1.5 text-center font-mono outline-none",
          withBorders && "border-y"
        )}
      >
        {isLoading ? <Spinner className="w-full size-6" /> : quantity}
      </p>
      <button
        className={cn(
          "hover:bg-muted-foreground/10 flex cursor-pointer items-center justify-center rounded-e-lg border px-3 py-1 focus-visible:z-10 disabled:cursor-not-allowed disabled:opacity-50",
          disabled && "pointer-events-none"
        )}
        onClick={handleIncrease}
        disabled={disabled || isLoading || (max !== null && quantity >= max)}
        aria-label="Increase quantity"
      >
        <Plus size={16} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
};

export default QuantityInput;
