"use client";

import { redirect } from "next/navigation";
import { useParams } from "next/navigation";
import { useGameState } from "@/lib/hooks/useGameState";

import RoomLobby from "@/components/multiplayer/phases/RoomLobby";
import GameQuestion from "@/components/multiplayer/phases/GameQuestion";
import GameFinished from "@/components/multiplayer/phases/GameFinished";

export default function RoomPageClient() {
  const params = useParams();
  const { currentPhase, currentRoom } = useGameState();

  if (!currentRoom) {
   redirect(`/lobby?c=${params.inviteCode}`)
  }

  if (currentPhase === "waiting" || currentPhase === "starting" ) {
    return <RoomLobby room={currentRoom} />;
  }

  if (currentPhase === "question") {
    return <GameQuestion room={currentRoom} />;
  }

  if (currentPhase === "results") {
    return <GameQuestion room={currentRoom} />;
  }

  if (currentPhase === "finished") {
    return <GameFinished room={currentRoom} />;
  }

  return <GameQuestion room={currentRoom} />;
} 