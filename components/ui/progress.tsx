"use client";

import type { ComponentProps } from "react";
import { Root, Indicator } from "@radix-ui/react-progress";

import { cn } from "@/lib/utils/strings";

type ProgressProps = ComponentProps<typeof Root> & {
  value?: number;
  durationMs?: number;
};

function Progress({ className, value, durationMs, ...props }: ProgressProps) {
  return (
    <Root
      data-slot="progress"
      className={cn(
        "bg-primary/20 relative h-2 w-full overflow-hidden rounded-full",
        className,
      )}
      {...props}
    >
      <Indicator
        data-slot="progress-indicator"
        className="bg-primary h-full w-full flex-1"
        style={{
          transform: `translateX(-${100 - (value || 0)}%)`,
          transition: durationMs
            ? `transform ${durationMs}ms linear`
            : undefined,
          willChange: "transform",
        }}
      />
    </Root>
  );
}

export { Progress };
