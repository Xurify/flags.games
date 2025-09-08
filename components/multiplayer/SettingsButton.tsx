import React from "react";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils/strings";

interface SettingsButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const SettingsButton = React.forwardRef<
  HTMLButtonElement,
  SettingsButtonProps
>(({ className, icon, label, value, ...props }, ref) => {
  return (
    <button
      ref={ref}
      className={cn(
        "flex items-center w-full text-left px-4 py-3 rounded-lg hover:bg-muted/80 transition-colors bg-card",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium">{label}</span>
      </div>
      <div className="ml-auto flex items-center gap-2 text-muted-foreground">
        <span>{value}</span>
        <ChevronDownIcon className="w-4 h-4" />
      </div>
    </button>
  );
});

export default SettingsButton;