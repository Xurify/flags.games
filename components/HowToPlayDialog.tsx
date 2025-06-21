import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
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
              <p>
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
                  <span className="inline-block w-3 h-3 bg-green-400 rounded mr-2"></span>
                  <strong>Level 1:</strong> Easy mode (15 countries)
                </li>
                <li>
                  <span className="inline-block w-3 h-3 bg-yellow-400 rounded mr-2"></span>
                  <strong>Level 2:</strong> Medium mode (25 countries)
                </li>
                <li>
                  <span className="inline-block w-3 h-3 bg-orange-400 rounded mr-2"></span>
                  <strong>Level 3:</strong> Hard mode (194 countries)
                </li>
                <li>
                  <span className="inline-block w-3 h-3 bg-red-400 rounded mr-2"></span>
                  <strong>Level 4:</strong> Expert mode (194 countries)
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
