"use client";

import React, { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { 
  UsersIcon, 
  SettingsIcon, 
  CrownIcon, 
  UserIcon, 
  CheckIcon, 
  PlayIcon, 
  LinkIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RoomSettings } from "@/lib/types/multiplayer";
import { Difficulty, ROOM_SIZES } from "@/lib/constants";
import { useRoomManagement } from "@/lib/hooks/useRoomManagement";
import { useSocket } from "@/lib/context/SocketContext";

const difficulties = ["easy", "medium", "hard", "expert"];
const timeLimits = [10, 15, 20, 30, 60];

interface MultiplayerRoomProps {
  onCreateRoom: (username: string, settings: RoomSettings) => void;
  isCreating?: boolean;
}

const MultiplayerRoom: React.FC<MultiplayerRoomProps> = ({
  onCreateRoom,
  isCreating = false,
}) => {
  const searchParams = useSearchParams();
  const inviteCode = searchParams.get("c");
  const { joinRoomByInviteCode } = useSocket();
  
  const {
    currentRoom,
    currentUser,
    isHost,
    canStartGame,
    updateRoomSettings,
  } = useRoomManagement();

  // Create room state
  const [username, setUsername] = useState("");
  const [settings, setSettings] = useState<RoomSettings>({
    maxRoomSize: 2,
    difficulty: "easy",
    gameMode: "classic",
    timeLimit: 30,
  });

  const handleCreateRoom = () => {
    if (username.trim().length >= 3) {
      onCreateRoom(username.trim(), settings);
    }
  };

  const isFormValid = username.trim().length >= 3;

  // If we have a room, show the lobby view
  if (currentRoom && currentRoom.settings) {
    const members = currentRoom.members;
    const maxPlayers = currentRoom.settings.maxRoomSize;
    const roomInviteCode = currentRoom.inviteCode || "";
    const inviteLink = roomInviteCode
      ? `${window.location.origin}/multiplayer?c=${roomInviteCode}`
      : "";

    const handleSettingChange = (
      key: keyof typeof currentRoom.settings,
      value: any
    ) => {
      if (isHost()) {
        updateRoomSettings({ ...currentRoom.settings, [key]: value });
      }
    };

    const handleReady = () => {
      // TODO: Implement ready up logic via socket
    };

    const handleStart = () => {
      // TODO: Implement start game logic via socket
    };

    const handleInvite = () => {
      if (inviteLink) navigator.clipboard.writeText(inviteLink);
    };

    return (
      <div className="flex items-center justify-center bg-background">
        <Card className="w-full max-w-6xl flex flex-col md:flex-row shadow-card">
          {/* Player List */}
          <div className="md:w-1/3 border-b md:border-b-0 md:border-r border-border flex flex-col items-center p-4 bg-card">
            <CardHeader className="w-full pb-2">
              <CardTitle className="text-base text-foreground text-center">
                Players {members.length}/{maxPlayers}
              </CardTitle>
            </CardHeader>
            <CardContent className="w-full flex flex-col gap-2 p-0">
              {[...members, ...Array(maxPlayers - members.length).fill(null)].map((player, idx) => (
                <div key={idx} className={`flex items-center gap-3 px-3 py-2 rounded-lg ${player ? "bg-muted" : "bg-muted/50"}`}>
                  {player ? (
                    <>
                      <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center">
                        {player.avatar ? <img src={player.avatar} alt={player.name} className="w-9 h-9 rounded-full" /> : <UserIcon className="w-5 h-5 text-muted-foreground" />}
                      </div>
                      <span className="font-medium text-foreground flex-1">{player.name || player.username}</span>
                      {currentRoom?.host === player.id && <CrownIcon className="w-4 h-4 text-yellow-400" aria-label="Host" />}
                      {player.isReady && <CheckIcon className="w-4 h-4 text-green-500" aria-label="Ready" />}
                    </>
                  ) : (
                    <span className="text-muted-foreground flex items-center gap-2"><UserIcon className="w-4 h-4" /> EMPTY</span>
                  )}
                </div>
              ))}
            </CardContent>
          </div>
          {/* Settings & Actions */}
          <div className="md:w-2/3 flex flex-col gap-6 p-4">
            <div className="mb-2">
              <h2 className="text-base font-semibold text-foreground mb-3 text-center md:text-left">Game Settings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="difficulty" className="text-sm font-medium">Difficulty</Label>
                  <Select value={currentRoom.settings.difficulty || "easy"} onValueChange={v => handleSettingChange("difficulty", v)} disabled={!isHost()}>
                    <SelectTrigger className="h-11 rounded-xl mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map(d => (
                        <SelectItem key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="roomSize" className="text-sm font-medium">Max Players</Label>
                  <Select value={String(currentRoom.settings.maxRoomSize || 4)} onValueChange={v => handleSettingChange("maxRoomSize", Number(v))} disabled={!isHost()}>
                    <SelectTrigger className="h-11 rounded-xl mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_SIZES.map(n => (
                        <SelectItem key={n} value={n.toString()}>{n}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="timeLimit" className="text-sm font-medium">Time per Question (seconds)</Label>
                  <Select value={String(currentRoom.settings.timePerQuestion || 30)} onValueChange={v => handleSettingChange("timePerQuestion", Number(v))} disabled={!isHost()}>
                    <SelectTrigger className="h-11 rounded-xl mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timeLimits.map(t => (
                        <SelectItem key={t} value={t.toString()}>{t} seconds</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mt-4">
              <Button variant="outline" className="flex items-center gap-2" onClick={handleInvite}>
                <LinkIcon className="w-4 h-4" /> Invite
              </Button>
              <Button variant={currentUser?.isReady ? "default" : "secondary"} className="flex items-center gap-2" onClick={handleReady}>
                <CheckIcon className="w-4 h-4" /> {currentUser?.isReady ? "Ready!" : "Ready Up"}
              </Button>
              {isHost() && (
                <Button variant="default" className="flex items-center gap-2" onClick={handleStart} disabled={!canStartGame()}>
                  <PlayIcon className="w-4 h-4" /> Start
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Show create room view if no room exists
  return (
    <div className="max-w-4xl w-full mx-auto">
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            Create New Room
          </CardTitle>
          <CardDescription className="text-center">
            Set up a new multiplayer game room for you and your friends
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username
            </Label>
            <Input
              id="username"
              placeholder="Enter your name (min. 3 characters)"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 rounded-xl"
              maxLength={24}
            />
            <p className="text-xs text-muted-foreground">
              {username.length}/24 characters
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              Game Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="maxPlayers" className="text-sm font-medium">
                  Max Players
                </Label>
                <Select
                  value={settings.maxRoomSize.toString()}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      maxRoomSize: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ROOM_SIZES.map((roomSize) => (
                      <SelectItem
                        key={`room-sizes-${roomSize}`}
                        value={roomSize.toString()}
                      >
                        {roomSize} Players
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="difficulty" className="text-sm font-medium">
                  Difficulty
                </Label>
                <Select
                  value={settings.difficulty}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      difficulty: value as Difficulty,
                    }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                    <SelectItem value="expert">Expert</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timeLimit" className="text-sm font-medium">
                  Time per Question (seconds)
                </Label>
                <Select
                  value={settings.timeLimit?.toString() || "30"}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      timeLimit: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 seconds</SelectItem>
                    <SelectItem value="15">15 seconds</SelectItem>
                    <SelectItem value="20">20 seconds</SelectItem>
                    <SelectItem value="30">30 seconds</SelectItem>
                    <SelectItem value="60">60 seconds</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="gameMode" className="text-sm font-medium">
                  Game Mode
                </Label>
                <Select
                  value={settings.gameMode}
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      gameMode: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="classic">Classic</SelectItem>
                    <SelectItem disabled={true} value="speed">
                      Speed Round
                    </SelectItem>
                    <SelectItem disabled={true} value="elimination">
                      Elimination
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          <div className="pt-4">
            <Button
              onClick={handleCreateRoom}
              disabled={!isFormValid || isCreating}
              className="w-full"
              size="lg"
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Creating Room...
                </>
              ) : (
                "Create Room"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MultiplayerRoom; 