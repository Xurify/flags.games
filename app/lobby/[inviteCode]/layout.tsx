"use client";

import React from "react";
import { useGameState } from "@/lib/hooks/useGameState";
import MultiplayerHeader from "@/components/multiplayer/MultiplayerHeader";
import { Room } from "@/lib/types/socket";

export default function InviteCodeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { currentRoom } = useGameState();

  const handleLeaveGame = () => {
    window.location.href = "/lobby";
  };

  return (
    <div className="min-h-screen h-screen sm:min-h-screen sm:h-auto bg-background overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-4">
          <MultiplayerHeader
            room={currentRoom as Room}
            onLeave={handleLeaveGame}
          />
        </div>
        {children}
      </div>
    </div>
  );
}
