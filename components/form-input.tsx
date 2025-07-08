// components/ui/form-input.tsx
"use client";

import { forwardRef, InputHTMLAttributes } from "react";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: string[];
  showForgotPasswordLink?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      label,
      type = "text",
      placeholder,
      autoComplete,
      required,
      className,
      error,
      showForgotPasswordLink = false,
      ...props
    },
    ref
  ) => {
    return (
      <div className="grid gap-2">
        <div className="flex items-center">
          <Label htmlFor={id}>{label}</Label>
          {showForgotPasswordLink && (
            <a
              href="#"
              className="ml-auto text-sm underline-offset-2 hover:underline"
            >
              Forgot your password?
            </a>
          )}
        </div>
        <div>
          <Input
            id={id}
            name={id}
            type={type}
            placeholder={placeholder}
            required={required}
            autoComplete={autoComplete}
            className={cn(className, error && "border-destructive")}
            ref={ref}
            {...props}
          />
          {error && (
            <p className="text-red-600 text-sm ml-1 mt-1">{error[0]}</p>
          )}
        </div>
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
