"use client";

import React from "react";
import { HomeIcon, UsersIcon } from "lucide-react";

import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Room } from "@/lib/types/socket";

interface MultiplayerHeaderProps {
  room: Room;
  onLeave: () => void;
  showDifficultyDialog?: boolean;
  setShowDifficultyDialog?: (open: boolean) => void;
}

export default function MultiplayerHeader({
  room,
  onLeave,
  showDifficultyDialog,
  setShowDifficultyDialog,
}: MultiplayerHeaderProps) {
  return (
    <Header
      leftContent={
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onLeave}
            className="text-muted-foreground hover:text-foreground"
          >
            <HomeIcon className="w-3 h-3" />
          </Button>
          <span className="text-sm font-medium text-foreground">
            MULTIPLAYER
          </span>
          <Badge variant="default" className="flex items-center gap-1">
            <UsersIcon className="w-3 h-3" />
            {room?.members?.length ?? 0}
          </Badge>
        </div>
      }
      showDifficultyDialog={showDifficultyDialog}
      setShowDifficultyDialog={setShowDifficultyDialog}
    />
  );
}
