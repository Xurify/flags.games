"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CrownIcon,
  UserIcon,
  LinkIcon,
  PlayIcon,
  UsersIcon,
  TimerIcon,
  BarChartIcon,
  CopyIcon,
  SettingsIcon,
  CopyCheckIcon,
  HomeIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import { SettingsSelect } from "@/components/multiplayer/SettingsSelect";
import {
  DIFFICULTY_LEVELS,
  ROOM_SIZES,
  TIME_PER_QUESTION_OPTIONS,
} from "@/lib/constants";
import { cn } from "@/lib/utils/strings";
import { useSocket } from "@/lib/context/SocketContext";
import { useRoomManagement } from "@/lib/hooks/useRoomManagement";
import { Room, User } from "@/lib/types/socket";

interface RoomLobbyProps {
  room: Room;
}

export default function RoomLobby({ room }: RoomLobbyProps) {
  const router = useRouter();
  const { currentUser, leaveRoom, gameState } = useSocket();
  const { isHost, canStartGame, startGame, updateRoomSettings } = useRoomManagement();
  const [copied, setCopied] = React.useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isStarting, setIsStarting] = useState(false);

  const members = room.members;
  const maxPlayers = room.settings.maxRoomSize;

  const handleSettingChange = (key: keyof typeof room.settings, value: any) => {
    if (isHost()) {
      updateRoomSettings({ ...room.settings, [key]: value });
    }
  };

  const handleStart = () => {
    setIsStarting(true);
    setCountdown(5);
    startGame();
  };

  useEffect(() => {
    if (isStarting && countdown !== null) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarting, countdown]);

  useEffect(() => {
    if (gameState?.phase === "starting") {
      setIsStarting(true);
      setCountdown(5);
    } else if (gameState?.phase === "question") {
      setIsStarting(false);
      setCountdown(null);
    }
  }, [gameState?.phase]);

  const handleInvite = () => {
    const inviteLink = room.inviteCode
      ? `${window.location.origin}/lobby?c=${room.inviteCode}`
      : "";
    if (inviteLink) navigator.clipboard.writeText(inviteLink);
    toast.success("Copied invite link to clipboard");
  };

  const handleCopyRoomCode = () => {
    if (room.inviteCode) {
      navigator.clipboard.writeText(room.inviteCode);
      toast.success("Room code copied to clipboard");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLeaveGame = async () => {
    await leaveRoom();
    router.push("/lobby");
  };

  return (
    <div className="min-h-screen h-screen sm:min-h-screen sm:h-auto bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-4">
          <Header
            leftContent={
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={handleLeaveGame}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HomeIcon className="w-3 h-3" />
                </Button>
                <span className="text-sm font-medium text-foreground">MULTIPLAYER</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <UsersIcon className="w-3 h-3" />
                  {room.members.length}
                </Badge>
              </div>
            }
          />
        </div>

        <div className="flex items-center justify-center">
          <Card className="w-full max-w-lg">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                    <UsersIcon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-foreground">
                      Room Lobby
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Waiting for players to join
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <div className="flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs">
                    <span className="font-mono text-foreground">
                      {room.inviteCode}
                    </span>
                    <button
                      onClick={handleCopyRoomCode}
                      className="h-5 w-5 p-0 transition-all duration-200 flex items-center justify-center"
                    >
                      {copied ? (
                        <CopyCheckIcon className="w-4 h-4 stroke-green-500" />
                      ) : (
                        <CopyIcon className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-b border-border">
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-base font-medium text-foreground">
                  Players ({members.length}/{maxPlayers})
                </h3>
              </div>
              <div className="space-y-2">
                {[...members, ...Array(maxPlayers - members.length).fill(null)].map(
                  (player: User | null, index) => (
                    <div
                      key={`player-${index}`}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ease-in-out min-h-[60px]",
                        player
                          ? "bg-card border-border/40 hover:bg-accent/30"
                          : "bg-muted/40 border-dashed border-border/60 opacity-80 animate-pulse"
                      )}
                    >
                      <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                        <UserIcon className="w-4 h-4 text-accent-foreground" />
                      </div>
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-foreground truncate">
                            {player ? player.username : "Waiting..."}
                          </span>
                          {player && room?.host === player.id && (
                            <CrownIcon className="w-3 h-3 text-chart-5 flex-shrink-0" />
                          )}
                        </div>
                        {player && (
                          <span className="text-xs text-muted-foreground">
                            {room?.host === player.id ? "Host" : "Player"}
                          </span>
                        )}
                      </div>
                    </div>
                  )
                )}
              </div>
              <div className="mt-3 text-xs text-muted-foreground text-center">
                {isStarting && countdown !== null ? (
                  <div className="flex items-center justify-center gap-2">
                    <PlayIcon className="w-3 h-3 animate-pulse" />
                    <span>Game starting in {countdown}...</span>
                  </div>
                ) : (
                  members.length < maxPlayers
                    ? `Waiting for ${maxPlayers - members.length} more player${
                        maxPlayers - members.length > 1 ? "s" : ""
                      }...`
                    : "Room is full!"
                )}
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <SettingsIcon className="w-4 h-4 text-muted-foreground" />
                <h3 className="text-base font-medium text-foreground">
                  Game Settings
                </h3>
              </div>
              <div className="space-y-3 mb-4">
                <SettingsSelect
                  icon={<UsersIcon className="w-3 h-3" />}
                  label="Max Players"
                  value={room.settings.maxRoomSize}
                  options={ROOM_SIZES.map((size) => ({
                    value: size,
                    label: `${size} players`,
                  }))}
                  onValueChange={(value) => {
                    if (members.length > value) {
                      toast.error(
                        "Cannot reduce max players below current number of players"
                      );
                      return;
                    }
                    return handleSettingChange("maxRoomSize", value);
                  }}
                  renderValue={(value) => `${value} players`}
                  disabled={!isHost() || isStarting}
                />
                <SettingsSelect
                  icon={<BarChartIcon className="w-3 h-3" />}
                  label="Difficulty"
                  value={room.settings.difficulty}
                  options={DIFFICULTY_LEVELS.map((level) => ({
                    value: level,
                    label: level.charAt(0).toUpperCase() + level.slice(1),
                  }))}
                  onValueChange={(value) =>
                    handleSettingChange("difficulty", value)
                  }
                  renderValue={(value) =>
                    value.charAt(0).toUpperCase() + value.slice(1)
                  }
                  disabled={!isHost() || isStarting}
                />
                <SettingsSelect
                  icon={<TimerIcon className="w-3 h-3" />}
                  label="Time per Question"
                  value={room.settings.timePerQuestion ?? 10}
                  options={TIME_PER_QUESTION_OPTIONS.map((time) => ({
                    value: time,
                    label: `${time} seconds`,
                  }))}
                  onValueChange={(value) =>
                    handleSettingChange("timePerQuestion", value)
                  }
                  renderValue={(value) => `${value}s`}
                  disabled={!isHost() || isStarting}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 flex items-center gap-1 text-sm"
                  onClick={handleInvite}
                >
                  <LinkIcon className="w-3 h-3" />
                  Invite
                </Button>
                {isHost() && (
                  <Button
                    variant="default"
                    size="sm"
                    className="flex-1 flex items-center gap-1 text-sm"
                    onClick={handleStart}
                    disabled={!canStartGame() || isStarting}
                  >
                    <PlayIcon className="w-3 h-3" />
                    {isStarting && countdown !== null ? `Starting in ${countdown}...` : "Start"}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
} 