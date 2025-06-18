import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border-0 px-3 py-1.5 text-xs font-semibold w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1.5 [&>svg]:pointer-events-none focus-visible:ring-ring/30 focus-visible:ring-4 transition-all duration-200 shadow-soft hover:shadow-button hover:-translate-y-0.5 transform-gpu",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        secondary:
          "bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
        destructive:
          "bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/30",
        outline:
          "text-foreground border-2 border-border/60 bg-background [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
        success:
          "bg-chart-2 text-white [a&]:hover:bg-chart-2/90",
        warning:
          "bg-chart-5 text-black [a&]:hover:bg-chart-5/90",
        info:
          "bg-chart-3 text-white [a&]:hover:bg-chart-3/90",
        playful:
          "bg-gradient-to-r from-chart-4 to-chart-1 text-white shadow-button [a&]:hover:from-chart-4/90 [a&]:hover:to-chart-1/90 [a&]:hover:scale-105"
      },
      size: {
        sm: "px-2 py-0.5 text-xs rounded-lg",
        default: "px-3 py-1.5 text-xs",
        lg: "px-4 py-2 text-sm rounded-2xl"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    },
  }
)

function Badge({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { 
    asChild?: boolean
    size?: "sm" | "default" | "lg"
  }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }