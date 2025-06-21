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

interface RestartDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRestart: () => void;
  gameCompleted: boolean;
  children: React.ReactNode;
}

const RestartDialog: React.FC<RestartDialogProps> = ({
  open,
  onOpenChange,
  onRestart,
  gameCompleted,
  children,
}) => (
  <AlertDialog open={open} onOpenChange={onOpenChange}>
    {!gameCompleted && (
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
    )}
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Restart Game</AlertDialogTitle>
        <AlertDialogDescription>
          Are you sure you want to restart the game? Your current progress will
          be lost.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onRestart}>Restart</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
);

export default RestartDialog;
