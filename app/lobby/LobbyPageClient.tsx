"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

import { DIFFICULTY_LEVELS, TIME_PER_QUESTION_OPTIONS } from "@/lib/constants";
import { useRoomManagement } from "@/lib/hooks/useRoomManagement";
import { RoomSettings } from "@/lib/types/socket";
import { getDifficultySettings } from "@/lib/utils/gameLogic";

import JoinRoomForm from "@/components/multiplayer/JoinRoomForm";
import CreateRoomForm from "@/components/multiplayer/CreateRoomForm";
import { useGameState } from "@/lib/hooks/useGameState";
import RoomLobby from "@/components/multiplayer/phases/RoomLobby";
import GameQuestion from "@/components/multiplayer/phases/GameQuestion";
import GameFinished from "@/components/multiplayer/phases/GameFinished";
import { usePageReloadProtection } from "@/lib/hooks/usePageReloadProtection";

interface LobbyPageClientProps {
  randomUsername: string;
}

export function LobbyPageClient({ randomUsername }: LobbyPageClientProps) {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("c");

  const { currentRoom, currentPhase } = useGameState();
  const { createRoom, joinRoom } = useRoomManagement();

  const shouldProtectReload =
    currentRoom && ["starting", "question", "results"].includes(currentPhase);

  usePageReloadProtection({
    enabled: !!shouldProtectReload,
    message:
      "You're in an active multiplayer game! Are you sure you want to leave? You'll lose your progress and disconnect from the game.",
  });

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const [username, setUsername] = useState("");
  const [settings, setSettings] = useState<RoomSettings>({
    maxRoomSize: 2,
    difficulty: DIFFICULTY_LEVELS[0],
    gameMode: "classic",
    timePerQuestion: TIME_PER_QUESTION_OPTIONS[1],
    questionCount: getDifficultySettings(DIFFICULTY_LEVELS[0]).count,
  });
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    settings?: string;
  }>({});

  useEffect(() => {
    if (!currentRoom) return;

    if (["question", "results", "finished"].includes(currentPhase)) {
      window.history.replaceState(null, "", "/battle");
    }
  }, [currentPhase, currentRoom]);

  const handleCreateRoom = async (
    username: string,
    roomSettings: RoomSettings
  ) => {
    setFormErrors({});
    setIsCreating(true);
    await createRoom(username, roomSettings);

    setIsCreating(false);
  };

  const handleJoinRoom = async (username: string) => {
    setFormErrors({});
    setIsJoining(true);
    if (inviteCode) {
      await joinRoom(inviteCode, username);
    }
    setIsJoining(false);
  };

  if (currentRoom) {
    if (["waiting", "starting"].includes(currentPhase)) {
      return (
        <div className="min-h-screen w-full bg-transparent mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <RoomLobby room={currentRoom} />
        </div>
      );
    }

    if (["question", "results"].includes(currentPhase)) {
      return <GameQuestion room={currentRoom} />;
    }

    if (currentPhase === "finished") {
      return <GameFinished room={currentRoom} />;
    }
  }

  return (
    <div className="min-h-screen w-full bg-transparent mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-foreground leading-[0.85] uppercase">
          Multiplayer
        </h1>
        <p className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground max-w-sm mx-auto">
          Play with your friends or join a public match.
        </p>
      </div>

      <div className="w-full">
        {inviteCode ? (
          <JoinRoomForm
            randomUsername={randomUsername}
            username={username}
            setUsername={setUsername}
            isJoining={isJoining}
            handleJoinRoom={handleJoinRoom}
            formErrors={formErrors}
            settings={settings}
          />
        ) : (
          <CreateRoomForm
            randomUsername={randomUsername}
            username={username}
            setUsername={setUsername}
            settings={settings}
            setSettings={setSettings}
            isCreating={isCreating}
            handleCreateRoom={handleCreateRoom}
            formErrors={formErrors}
          />
        )}
      </div>
    </div>
  );
}
