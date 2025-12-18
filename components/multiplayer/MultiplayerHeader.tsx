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
            <HomeIcon className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-foreground/10 mx-1" />
          <Badge variant="secondary" className="flex items-center gap-1.5 font-black border-2 border-foreground shadow-retro">
            <UsersIcon className="w-3.5 h-3.5" />
            {room?.members?.length || "0"}
          </Badge>
        </div>
      }
    />
  );
}
