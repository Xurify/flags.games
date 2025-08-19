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
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle className="text-2xl">How to Play</AlertDialogTitle>
        <AlertDialogDescription asChild>
          <div className="space-y-4 text-sm">
            <div>
              <p className="text-muted-foreground dark:text-gray-400">
                Identify the country that each flag belongs to by selecting the
                correct answer from the multiple choice options.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-foreground mb-2">
                Difficulty Levels
              </h4>
              <ul className="space-y-1">
                <li>
                  <span className="inline-block w-3 h-3 bg-green-600 rounded mr-2"></span>
                  <strong className="text-green-600">Easy</strong> <span className="text-xs text-muted-foreground dark:text-gray-400">(4 countries)</span>
                  <span className="block text-xs text-muted-foreground dark:text-foreground ml-5">Only the most recognizable/distinctive flags worldwide.</span>
                </li>
                <li>
                  <span className="inline-block w-3 h-3 bg-yellow-500 rounded mr-2"></span>
                  <strong className="text-yellow-500">Medium</strong> <span className="text-xs text-muted-foreground dark:text-gray-400">(25 countries)</span>
                  <span className="block text-xs text-muted-foreground dark:text-foreground ml-5">Like easy difficulty, includes moderately recognizable flags.</span>
                </li>
                <li>
                  <span className="inline-block w-3 h-3 bg-orange-400 rounded mr-2"></span>
                  <strong className="text-orange-400">Hard</strong> <span className="text-xs text-muted-foreground dark:text-gray-400">(197 countries)</span>
                  <span className="block text-xs text-muted-foreground dark:text-foreground ml-5">All countries, more obscure/unknown flags.</span>
                </li>
                <li>
                  <span className="inline-block w-3 h-3 bg-red-500 rounded mr-2"></span>
                    <strong className="text-red-500">Expert</strong> <span className="text-xs text-muted-foreground dark:text-gray-400">(197 countries)</span>
                  <span className="block text-xs text-muted-foreground dark:text-foreground ml-5">All countries, similar to hard difficulty, but with more challenging options</span>
                </li>
              </ul>
            </div>
          </div>
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogAction>Got it!</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default HowToPlayDialog;
