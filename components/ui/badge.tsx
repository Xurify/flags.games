import type { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/strings";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-sm border-2 px-3 py-1.5 text-xs font-bold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:ring-ring focus-visible:ring-2 uppercase tracking-wide",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border-foreground",
        secondary:
          "bg-secondary text-secondary-foreground border-foreground",
        destructive:
          "bg-destructive text-white border-foreground",
        outline:
          "text-foreground border-foreground bg-background hover:bg-accent hover:text-accent-foreground",
        success: "bg-chart-2 text-white border-foreground",
        warning: "bg-chart-5 text-black border-foreground",
        info: "bg-chart-3 text-white border-foreground",
        playful:
          "bg-gradient-to-r from-chart-4 to-chart-1 text-white border-foreground shadow-retro",
      },
      size: {
        sm: "px-2 py-0.5 text-[10px]",
        default: "px-3 py-1.5 text-xs",
        lg: "px-4 py-2 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & {
    asChild?: boolean;
    size?: "sm" | "default" | "lg";
  }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
