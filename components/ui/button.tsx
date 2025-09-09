import { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/strings";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-4 active:scale-98 cursor-pointer disabled:cursor-not-allowed transform-gpu",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-sm hover:shadow-md hover:bg-primary/90 hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-white shadow-sm hover:shadow-md hover:bg-destructive/90 hover:-translate-y-0.5 focus-visible:ring-destructive/30",
        outline:
          "border-2 bg-[oklch(1_0_0)] hover:bg-[oklch(0.97_0.01_240_/_0.4)] hover:border-[oklch(0.7_0.01_240)] hover:-translate-y-1 border-[oklch(0.92_0_0)] dark:bg-[oklch(0.17_0.002_240)] dark:border-[oklch(0.7_0.01_240)]",
        neutral:
          "border-2 bg-[oklch(0.95_0.01_100)]/40 hover:bg-[oklch(0.93_0.012_100)]/50 hover:-translate-y-1 border-[oklch(0.92_0.008_100)] text-foreground dark:bg-[#2e2e2e] dark:border-[#1d1d1d]",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:shadow-md hover:bg-secondary/80 hover:-translate-y-0.5",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5",
        link: "text-primary underline-offset-4 hover:underline rounded-lg",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-5",
        sm: "h-9 gap-1.5 px-4 text-xs font-medium has-[>svg]:px-3",
        lg: "h-13 rounded-xl px-8 text-base has-[>svg]:px-6",
        icon: "size-11 rounded-lg",
        "icon-sm": "size-9 rounded-md",
        pill: "h-11 px-8 rounded-full",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
