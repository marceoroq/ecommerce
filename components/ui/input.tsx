import * as React from "react";

import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

interface InputWithIconProps extends React.ComponentPropsWithoutRef<typeof Input> {
  icon?: React.ReactNode;
  iconPlacement?: "left" | "right";
}

const InputWithIcon = React.forwardRef<HTMLInputElement, InputWithIconProps>(
  ({ className, icon, iconPlacement = "left", type, ...props }, ref) => {
    return (
      <div
        className={cn(
          "relative flex items-center rounded-md border border-input bg-transparent shadow-sm",
          "focus-within:ring-1 focus-within:ring-ring",
          "h-9 w-full px-3 py-1 text-base md:text-sm !mt-0",
          className
        )}
      >
        {icon && iconPlacement === "left" && (
          <span className="mr-2 text-muted-foreground">{icon}</span>
        )}
        <Input
          type={type}
          className={cn(
            "flex-1 border-0 bg-transparent px-0 py-0 shadow-none focus-visible:ring-0"
          )}
          ref={ref}
          {...props}
        />
        {icon && iconPlacement === "right" && (
          <span className="ml-2 text-muted-foreground">{icon}</span>
        )}
      </div>
    );
  }
);
InputWithIcon.displayName = "InputWithIcon";

export { Input, InputWithIcon };
