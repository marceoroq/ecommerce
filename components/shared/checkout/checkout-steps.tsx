"use client";

import { usePathname } from "next/navigation";
import { motion, useMotionValue, animate } from "framer-motion";
import { Fragment, useCallback, useRef, useEffect } from "react";
import Link from "next/link";

const STEPS = [
  { url: "shipping-address", label: "Shipping Address" },
  { url: "payment-method", label: "Payment Method" },
  { url: "place-order", label: "Place Order" },
];

const CheckoutSteps = () => {
  const currentPathname = usePathname().split("/").at(-1);
  const currentIndex = STEPS.findIndex((s) => s.url === currentPathname);
  const LAST_VALUE = STEPS.length - 1;

  const containerRef = useRef<HTMLDivElement>(null);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Motion values for animation
  const indicatorX = useMotionValue(0);
  const indicatorWidth = useMotionValue(0);

  const setStepRef = useCallback(
    (index: number) => (el: HTMLDivElement | null) => {
      stepRefs.current[index] = el;
    },
    []
  );

  useEffect(() => {
    const updateIndicatorPosition = () => {
      const activeStep = stepRefs.current[currentIndex];
      const container = containerRef.current;

      if (!activeStep || !container) return;

      const containerRect = container.getBoundingClientRect();
      const stepRect = activeStep.getBoundingClientRect();

      const x = stepRect.left - containerRect.left;
      const width = stepRect.width;

      // Animate values with Framer Motion
      animate(indicatorX, x, {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      });

      animate(indicatorWidth, width, {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      });
    };

    updateIndicatorPosition();

    // Update in resize
    const handleResize = () => {
      updateIndicatorPosition();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [currentIndex, indicatorX, indicatorWidth]);

  return (
    <div
      ref={containerRef}
      className="max-w-md sm:max-w-2xl w-full relative flex-between flex-row gap-2 sm:gap-4"
    >
      {/* Animated indicator with Framer Motion */}
      <motion.div
        className="absolute h-12 sm:h-9 rounded-full bg-foreground/10 z-10"
        style={{
          x: indicatorX,
          width: indicatorWidth,
        }}
      />

      {STEPS.map((step, i) => (
        <Fragment key={step.url}>
          <Link href={`/${step.url}`} className="relative z-20">
            <motion.div
              className="w-24 sm:w-32 p-2 text-center text-sm !m-0"
              ref={setStepRef(i)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {step.label}
            </motion.div>
          </Link>
          {i !== LAST_VALUE && (
            <hr className="w-full border-t border-gray-300 !mt-0" />
          )}
        </Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
