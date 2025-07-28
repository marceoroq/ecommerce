"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export const RedirectToOrder = ({
  orderId,
  className = "",
}: {
  orderId: string;
  className?: string;
}) => {
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prev: number) => prev - 1);
    }, 1000);

    const timer = setTimeout(() => {
      redirect(`/order/${orderId}`);
    }, 10000);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, []);

  return (
    <p className={cn(className)}>
      You will be redirected to your order page in {countdown} seconds...
    </p>
  );
};
