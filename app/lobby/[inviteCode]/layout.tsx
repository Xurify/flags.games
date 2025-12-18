"use client";

import React from "react";
import { Room } from "@/lib/types/socket";
import { useGameState } from "@/lib/hooks/useGameState";
import MultiplayerHeader from "@/components/multiplayer/MultiplayerHeader";

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
    <div className="min-h-screen w-full bg-transparent max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="mb-4">
        <MultiplayerHeader
          room={currentRoom as Room}
          onLeave={handleLeaveGame}
        />
      </div>
      {children}
    </div>
  );
}
