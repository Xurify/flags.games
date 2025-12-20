import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface RestartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestart: () => void;
  gameCompleted: boolean;
  children: React.ReactNode;
}

const RestartDialog: React.FC<RestartDialogProps> = ({ open, onOpenChange, onRestart, gameCompleted, children }) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    {!gameCompleted && <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>}
    <AlertDialogContent className="max-w-[92vw] sm:max-w-md p-4 sm:p-8 max-h-[85vh] overflow-y-auto">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-2xl font-black uppercase tracking-tight text-destructive">
          Restart Game
        </AlertDialogTitle>
        <div className="text-sm font-medium pt-2">
          Are you sure you want to restart? Your current session progress will be wiped.
        </div>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="font-bold uppercase tracking-wide">Cancel</AlertDialogCancel>
        <AlertDialogAction variant="destructive" onClick={onRestart} className="font-black uppercase tracking-wide">
          Restart
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default RestartDialog;
