import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils/strings"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all duration-200 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-4 active:scale-95 cursor-pointer disabled:cursor-not-allowed transform-gpu",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:shadow hover:bg-primary/90 hover:-translate-y-0.5",
        destructive:
          "bg-destructive text-white shadow hover:shadow hover:bg-destructive/90 hover:-translate-y-0.5 focus-visible:ring-destructive/30",
        outline:
          "border-2 bg-background shadow hover:shadow hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 border-border/60",
        secondary:
          "bg-secondary text-secondary-foreground shadow hover:shadow hover:bg-secondary/80 hover:-translate-y-0.5",
        ghost:
          "hover:bg-accent hover:text-accent-foreground hover:shadow rounded-xl",
        link: "text-primary underline-offset-4 hover:underline rounded-lg",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-5",
        sm: "h-9 rounded-xl gap-1.5 px-4 text-xs font-medium has-[>svg]:px-3",
        lg: "h-13 rounded-2xl px-8 text-base has-[>svg]:px-6",
        icon: "size-11 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
        pill: "h-11 px-8 rounded-full"
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }