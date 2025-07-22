"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import { toast } from "sonner";

import {
  DIFFICULTY_LEVELS,
  TIME_PER_QUESTION_OPTIONS,
  ROOM_SIZES,
} from "@/lib/constants";
import { useRoomManagement } from "@/lib/hooks/useRoomManagement";
import { RoomSettings } from "@/lib/types/socket";

import RoomLobby from "@/components/multiplayer/RoomLobby";
import JoinRoomForm from "@/components/multiplayer/JoinRoomForm";
import CreateRoomForm from "@/components/multiplayer/CreateRoomForm";

const roomSettingsSchema = z.object({
  maxRoomSize: z
    .number()
    .min(2)
    .max(ROOM_SIZES[ROOM_SIZES.length - 1]),
  difficulty: z.enum(DIFFICULTY_LEVELS),
  gameMode: z.string(),
  timePerQuestion: z.number().min(10).max(60),
});

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

 const handleCreateRoom = async (finalUsername: string, roomSettings: RoomSettings) => {
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
