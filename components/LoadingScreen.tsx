"use client";

import React from "react";

interface LoadingScreenProps {
  message?: string;
  fullscreen?: boolean;
  variant?: "minimal" | "card";
  size?: "normal" | "compact";
}

export default function LoadingScreen({
  message = "Loading...",
  fullscreen = false,
  variant = "minimal",
  size = "normal",
}: LoadingScreenProps) {
  const containerClass = `${
    fullscreen
      ? "min-h-[70vh] sm:min-h-[80vh]"
      : size === "compact"
      ? ""
      : "min-h-[40vh]"
  } flex items-center justify-center ${size === "compact" ? "py-3" : "p-6"}`;

  return (
    <div className={containerClass}>
      <div className="flex flex-col items-center gap-3">
        <div className="flex items-center gap-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-primary animate-pulse" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/80 animate-pulse [animation-delay:150ms]" />
          <span className="h-2.5 w-2.5 rounded-full bg-primary/60 animate-pulse [animation-delay:300ms]" />
        </div>
        <div className="text-sm text-muted-foreground">{message}</div>
      </div>
    </div>
  );
}
