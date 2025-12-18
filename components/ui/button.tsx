import { ComponentProps } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils/strings";
import { audioManager } from "@/lib/utils/audio-manager";
import { useSettings } from "@/lib/context/SettingsContext";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm text-sm font-bold uppercase tracking-wide transition-retro disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/30 focus-visible:ring-4 cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground border-2 border-foreground shadow-retro hover:shadow-retro-hover active:shadow-retro-pressed active:translate-x-[2px] active:translate-y-[2px] hover:-translate-y-[2px] hover:-translate-x-[2px]",
        destructive:
          "bg-destructive text-white border-2 border-foreground shadow-retro hover:shadow-retro-hover active:shadow-retro-pressed active:translate-x-[2px] active:translate-y-[2px] hover:-translate-y-[2px] hover:-translate-x-[2px]",
        outline:
          "bg-background text-foreground border-2 border-foreground shadow-retro hover:shadow-retro-hover active:shadow-retro-pressed active:translate-x-[2px] active:translate-y-[2px] hover:-translate-y-[2px] hover:-translate-x-[2px]",
        neutral:
          "bg-muted text-foreground border-2 border-foreground shadow-retro hover:shadow-retro-hover active:shadow-retro-pressed active:translate-x-[2px] active:translate-y-[2px] hover:-translate-y-[2px] hover:-translate-x-[2px]",
        secondary:
          "bg-secondary text-secondary-foreground border-2 border-foreground shadow-retro hover:shadow-retro-hover active:shadow-retro-pressed active:translate-x-[2px] active:translate-y-[2px] hover:-translate-y-[2px] hover:-translate-x-[2px]",
        ghost:
          "hover:bg-primary hover:text-primary-foreground border-2 border-transparent hover:border-foreground hover:shadow-retro",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-6 py-3 has-[>svg]:px-5",
        sm: "h-9 gap-1.5 px-4 text-xs font-bold has-[>svg]:px-3",
        lg: "h-14 px-8 text-base has-[>svg]:px-6",
        icon: "size-11",
        "icon-sm": "size-9",
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
  playClickSound = false,
  onClick,
  ...props
}: ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    playClickSound?: boolean;
  }) {
  const Comp = asChild ? Slot : "button";
  const { settings } = useSettings();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (playClickSound && settings.soundEffectsEnabled) {
      audioManager.playButtonClickSound();
    }
    onClick?.(event);
  };

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={handleClick}
      {...props}
    />
  );
}

export { Button, buttonVariants };
