"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SettingsSelect } from "@/components/multiplayer/SettingsSelect";
import {
  DIFFICULTY_LEVELS,
  ROOM_SIZES,
  TIME_PER_QUESTION_OPTIONS,
} from "@/lib/constants";
import { cn } from "@/lib/utils/strings";
import { useSocket } from "@/lib/context/SocketContext";
import { useGameState } from "@/lib/hooks/useGameState";
import { useRoomManagement } from "@/lib/hooks/useRoomManagement";
import { Room, User } from "@/lib/types/socket";
import { useSettings } from "@/lib/context/SettingsContext";
import { audioManager } from "@/lib/utils/audioUtils";

interface RoomLobbyProps {
  room: Room;
}

export default function RoomLobby({ room }: RoomLobbyProps) {
  const { currentRoom } = useSocket();
  const { isHost, canStartGame, startGame, updateRoomSettings } =
    useRoomManagement();
  const { settings } = useSettings();
  const [copied, setCopied] = React.useState(false);
  const [gameStartingCountdown, setGameStartingCountdown] = useState<number | null>(null);
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
    setGameStartingCountdown(5);
    startGame();
  };

  useEffect(() => {
    if (isStarting && gameStartingCountdown !== null) {
      const timer = setInterval(() => {
        setGameStartingCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarting, gameStartingCountdown]);

  useEffect(() => {
    if (!isStarting || gameStartingCountdown === null) return;
    if (!settings.soundEffectsEnabled) return;
    if (gameStartingCountdown > 0) {
      const frequency = gameStartingCountdown <= 1 ? 800 : 600;
      audioManager.playTone(frequency, 0.18, "sine");
    }
  }, [isStarting, gameStartingCountdown, settings.soundEffectsEnabled]);

  useEffect(() => {
    if (currentRoom?.gameState?.phase === "starting") {
      setIsStarting(true);
      setGameStartingCountdown(5);
    } else if (currentRoom?.gameState?.phase === "question") {
      setIsStarting(false);
      setGameStartingCountdown(null);
    }
  }, [currentRoom?.gameState?.phase]);

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

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <div className="p-4 border-b border-border">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
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
            <div
              className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-primary/5 border border-primary/20 text-xs cursor-pointer hover:bg-primary/10 transition-colors w-fit"
              onClick={handleCopyRoomCode}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  handleCopyRoomCode();
                }
              }}
            >
              <LinkIcon className="w-3 h-3 text-primary flex-shrink-0" />
              <span className="text-muted-foreground">Invite Code:</span>
              <span className="font-mono font-semibold text-primary tracking-wide">
                {room.inviteCode}
              </span>
              {copied ? (
                <CopyCheckIcon className="w-3 h-3 text-green-600 flex-shrink-0" />
              ) : (
                <CopyIcon className="w-3 h-3 text-primary flex-shrink-0" />
              )}
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
                      ? "bg-card dark:bg-input border-border/60 dark:border-border/90 hover:bg-accent/30 dark:hover:bg-input/30"
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
            {isStarting && gameStartingCountdown !== null ? (
              <div className="flex items-center justify-center gap-2">
                <PlayIcon className="w-3 h-3 animate-pulse" />
                <span>Game starting in {gameStartingCountdown}...</span>
              </div>
            ) : members.length < maxPlayers ? (
              `Waiting for ${maxPlayers - members.length} more player${
                maxPlayers - members.length > 1 ? "s" : ""
              }...`
            ) : (
              "Room is full!"
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
              value={room.settings.timePerQuestion}
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
                {isStarting && gameStartingCountdown !== null
                  ? `Starting in ${gameStartingCountdown}...`
                  : "Start"}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
