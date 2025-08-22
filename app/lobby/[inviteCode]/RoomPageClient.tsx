"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { useGameState } from "@/lib/hooks/useGameState";
import { usePageReloadProtection } from "@/lib/hooks/usePageReloadProtection";

import RoomLobby from "@/components/multiplayer/phases/RoomLobby";
import GameQuestion from "@/components/multiplayer/phases/GameQuestion";
import GameFinished from "@/components/multiplayer/phases/GameFinished";

export default function RoomPageClient() {
  const router = useRouter();
  const { currentPhase, currentRoom, connectionState } = useGameState();

  const shouldProtectReload =
    currentRoom && ["starting", "question", "results"].includes(currentPhase);

  usePageReloadProtection({
    enabled: !!shouldProtectReload,
    message:
      "You're in an active multiplayer game! Are you sure you want to leave? You'll lose your progress and disconnect from the game.",
  });

  useEffect(() => {
    if (connectionState === "connected" && !currentRoom) {
      router.push("/lobby");
    }
  }, [connectionState, currentRoom, router]);

  if (!currentRoom) return null;

  if (currentPhase === "waiting" || currentPhase === "starting") {
    return <RoomLobby room={currentRoom} />;
  }

  if (["question", "results"].includes(currentPhase)) {
    return <GameQuestion room={currentRoom} />;
  }

  if (currentPhase === "finished") {
    return <GameFinished room={currentRoom} />;
  }

  return <GameQuestion room={currentRoom} />;
}
