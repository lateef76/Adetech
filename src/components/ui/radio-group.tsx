import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const radioGroupVariants = cva(
  "border-2 border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 h-4 w-4",
  {
    variants: {
      variant: {
        default: "border-primary",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface RadioGroupProps
  extends
    React.InputHTMLAttributes<HTMLInputElement>,
    VariantProps<typeof radioGroupVariants> {}

const RadioGroup = React.forwardRef<HTMLInputElement, RadioGroupProps>(
  ({ className, variant, ...props }, ref) => (
    <input
      type="radio"
      ref={ref}
      className={cn(radioGroupVariants({ variant }), className)}
      {...props}
    />
  ),
);
RadioGroup.displayName = "RadioGroup";

export { RadioGroup };
