import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface HowToPlayDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const HowToPlayDialog: React.FC<HowToPlayDialogProps> = ({
  open,
  onOpenChange,
  children,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
    <AlertDialogContent className="max-w-[92vw] sm:max-w-xl p-4 sm:p-8 max-h-[85vh] overflow-y-auto">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight flex items-center gap-2">
          <span>How to Play</span>
        </AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-6 pt-2">
            <div>
              <p className="text-muted-foreground font-mono leading-relaxed">
                <span className="font-bold text-foreground">Objective:</span> Identify the country that each flag belongs to by selecting the
                correct answer from the multiple choice options.
              </p>
            </div>
            <div>
              <h4 className="font-black uppercase tracking-tight text-base mb-3 border-b-2 border-foreground/10 pb-1">
                Difficulty Levels
              </h4>
              <ul className="space-y-3">
                <li>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-3 h-3 bg-green-600 rounded-sm border border-foreground/20"></span>
                    <strong className="text-green-600 font-bold uppercase tracking-wide text-sm">Easy</strong>
                    <span className="text-xs font-mono text-muted-foreground border border-foreground/20 rounded-sm px-1 py-0.5 ml-1">4 FLAGS</span>
                  </div>
                  <span className="block text-xs text-muted-foreground ml-5 font-mono">Only the most recognizable/distinctive flags worldwide.</span>
                </li>
                <li>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-3 h-3 bg-yellow-500 rounded-sm border border-foreground/20"></span>
                    <strong className="text-yellow-500 font-bold uppercase tracking-wide text-sm">Medium</strong>
                    <span className="text-xs font-mono text-muted-foreground border border-foreground/20 rounded-sm px-1 py-0.5 ml-1">25 FLAGS</span>
                  </div>
                  <span className="block text-xs text-muted-foreground ml-5 font-mono">Like easy difficulty, includes moderately recognizable flags.</span>
                </li>
                <li>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-3 h-3 bg-orange-400 rounded-sm border border-foreground/20"></span>
                    <strong className="text-orange-400 font-bold uppercase tracking-wide text-sm">Hard</strong>
                    <span className="text-xs font-mono text-muted-foreground border border-foreground/20 rounded-sm px-1 py-0.5 ml-1">197 FLAGS</span>
                  </div>
                  <span className="block text-xs text-muted-foreground ml-5 font-mono">All countries, more obscure/unknown flags.</span>
                </li>
                <li>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="inline-block w-3 h-3 bg-red-500 rounded-sm border border-foreground/20"></span>
                    <strong className="text-red-500 font-bold uppercase tracking-wide text-sm">Expert</strong>
                    <span className="text-xs font-mono text-muted-foreground border border-foreground/20 rounded-sm px-1 py-0.5 ml-1">197 FLAGS</span>
                  </div>
                  <span className="block text-xs text-muted-foreground ml-5 font-mono">All countries, similar to hard difficulty, but with more challenging options</span>
                </li>
              </ul>
            </div>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction className="font-black uppercase tracking-wide">Okay</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default HowToPlayDialog;
