"use client";

import React, { useState } from "react";
import { useSearchParams } from "next/navigation";

import { DIFFICULTY_LEVELS, TIME_PER_QUESTION_OPTIONS } from "@/lib/constants";
import { useRoomManagement } from "@/lib/hooks/useRoomManagement";
import { RoomSettings } from "@/lib/types/socket";

import RoomLobby from "@/components/multiplayer/RoomLobby";
import JoinRoomForm from "@/components/multiplayer/JoinRoomForm";
import CreateRoomForm from "@/components/multiplayer/CreateRoomForm";

interface MultiplayerRoomProps {
  randomUsername: string;
}

const MultiplayerRoom: React.FC<MultiplayerRoomProps> = ({
  randomUsername,
}) => {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("c");

  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const {
    currentRoom: room,
    isHost,
    canStartGame,
    updateRoomSettings,
    createRoom,
    joinRoom,
  } = useRoomManagement();

  const [username, setUsername] = useState("");
  const [settings, setSettings] = useState<RoomSettings>({
    maxRoomSize: 2,
    difficulty: DIFFICULTY_LEVELS[0],
    gameMode: "classic",
    timePerQuestion: TIME_PER_QUESTION_OPTIONS[3],
  });
  const [formErrors, setFormErrors] = useState<{
    username?: string;
    settings?: string;
  }>({});

  const handleCreateRoom = async (
    finalUsername: string,
    roomSettings: RoomSettings
  ) => {
    setFormErrors({});
    setIsCreating(true);
    await createRoom(finalUsername, roomSettings);
    setIsCreating(false);
  };

  const handleJoinRoom = async (finalUsername: string) => {
    setFormErrors({});
    setIsJoining(true);
    inviteCode && (await joinRoom(inviteCode, finalUsername));
    setIsJoining(false);
  };

  if (room?.settings) {
    return (
      <RoomLobby
        room={room}
        isHost={isHost}
        canStartGame={canStartGame}
        updateRoomSettings={updateRoomSettings}
      />
    );
  }

  if (inviteCode) {
    return (
      <JoinRoomForm
        randomUsername={randomUsername}
        username={username}
        setUsername={setUsername}
        isJoining={isJoining}
        handleJoinRoom={handleJoinRoom}
        formErrors={formErrors}
        settings={settings}
      />
    );
  }

  return (
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
  );
};

export default MultiplayerRoom;
