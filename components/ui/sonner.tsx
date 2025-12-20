"use client";

import { Toaster as Sonner, ToasterProps } from "sonner";
import { CheckCircle2, AlertTriangle, AlertCircle, Info } from "lucide-react";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      richColors={false}
      position="bottom-center"
      icons={{
        success: <CheckCircle2 className="w-5 h-5 text-green-600" />,
        error: <AlertCircle className="w-5 h-5 text-red-600" />,
        warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
        info: <Info className="w-5 h-5 text-blue-500" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast !rounded-none !border-2 !border-foreground !bg-background !shadow-retro !p-6 flex items-start gap-4 transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none",
          title: "!font-black !uppercase !tracking-tight !text-sm !text-foreground !font-sans",
          description:
            "!font-mono !text-[10px] !uppercase !tracking-widest !text-muted-foreground !mt-1.5 !leading-relaxed",
          icon: "!mt-0.5",
          success: "!border-green-600",
          error: "!border-red-600",
          warning: "!border-yellow-500",
          info: "!border-blue-500",
          actionButton:
            "!rounded-none !border-2 !border-foreground !bg-foreground !text-background !font-black !text-[10px] !uppercase !tracking-wide !h-9 !px-4 hover:!bg-primary hover:!text-primary-foreground transition-colors",
          cancelButton:
            "!rounded-none !border-2 !border-foreground !bg-muted !text-muted-foreground !font-black !text-[10px] !uppercase !tracking-wide !h-9 !px-4 hover:!bg-foreground hover:!text-background transition-colors",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
