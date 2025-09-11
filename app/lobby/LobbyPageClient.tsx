"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { HomeIcon } from "lucide-react";

import { DIFFICULTY_LEVELS, TIME_PER_QUESTION_OPTIONS } from "@/lib/constants";
import { useRoomManagement } from "@/lib/hooks/useRoomManagement";
import { RoomSettings } from "@/lib/types/socket";
import { getDifficultySettings } from "@/lib/utils/gameLogic";

import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import JoinRoomForm from "@/components/multiplayer/JoinRoomForm";
import CreateRoomForm from "@/components/multiplayer/CreateRoomForm";

interface LobbyPageClientProps {
  randomUsername: string;
}

export function LobbyPageClient({
  randomUsername,
}: LobbyPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("c");

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const { currentRoom: room, createRoom, joinRoom } = useRoomManagement();

  useEffect(() => {
    if (room?.inviteCode) {
      router.push(`/lobby/${room.inviteCode}`);
    }
  }, [room?.inviteCode, router]);

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

  const handleCreateRoom = async (
    username: string,
    roomSettings: RoomSettings
  ) => {
    setFormErrors({});
    setIsCreating(true);
    await createRoom(username, roomSettings);
    if (room) {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async (username: string) => {
    setFormErrors({});
    setIsJoining(true);
    if (inviteCode) {
      await joinRoom(inviteCode, username);
    }
    setIsJoining(false);
  };

  return (
    <div className="flex justify-center bg-background">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-8">
          <Header
            leftContent={
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => router.push("/")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HomeIcon className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-foreground">
                  MULTIPLAYER
                </span>
              </div>
            }
          />
        </div>
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
