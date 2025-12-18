import { ComponentProps } from "react";

import { cn } from "@/lib/utils/strings";

function Input({ className, type, ...props }: ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-black selection:text-white border-foreground flex h-9 w-full min-w-0 rounded-sm border-2 bg-input px-3 py-1 text-base transition-all outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-bold disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm font-mono shadow-sm",
        "focus-visible:border-foreground focus-visible:ring-foreground/100 focus-visible:ring-2 focus-visible:shadow-retro-pressed",
        "aria-invalid:border-destructive aria-invalid:ring-destructive",
        className
      )}
      {...props}
    />
  );
}

export { Input };
