"use client";

import React, { useState, useEffect, useRef } from "react";
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
  QrCodeIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SettingsSelect } from "@/components/multiplayer/SettingsSelect";
import QRCodeShareModal from "@/components/multiplayer/QRCodeShareModal";
import {
  DIFFICULTY_LEVELS,
  ROOM_SIZES,
  TIME_PER_QUESTION_OPTIONS,
} from "@/lib/constants";
import { cn } from "@/lib/utils/strings";
import { useSocket } from "@/lib/context/SocketContext";
import { useRoomManagement } from "@/lib/hooks/useRoomManagement";
import { useSettings } from "@/lib/context/SettingsContext";
import { Room, User } from "@/lib/types/socket";
import { audioManager } from "@/lib/utils/audio-manager";
import { prefetchAllFlags } from "@/lib/utils/image";

interface RoomLobbyProps {
  room: Room;
}

export default function RoomLobby({ room }: RoomLobbyProps) {
  const { currentRoom } = useSocket();
  const { isHost, canStartGame, startGame, updateRoomSettings } =
    useRoomManagement();
  const { settings } = useSettings();
  const [copied, setCopied] = React.useState(false);
  const [gameStartingCountdown, setGameStartingCountdown] = useState<
    number | null
  >(null);
  const [isStarting, setIsStarting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const members = room.members;
  const maxPlayers = room.settings.maxRoomSize;

  useEffect(() => {
    prefetchAllFlags(room.settings.difficulty);
  }, [room.settings.difficulty]);

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
    setShowQRModal(true);
  };

  const inviteLink = room.inviteCode
    ? `${window.location.origin}/lobby?c=${room.inviteCode}`
    : "";

  const handleCopyRoomInviteLink = () => {
    clearCopiedTimeout();
    if (room.inviteCode) {
      navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied to clipboard");
      setCopied(true);
      copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

  const clearCopiedTimeout = () => {
    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = null;
    }
  };

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

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-lg">
        <div className="p-3 sm:p-4 border-b border-border">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <UsersIcon className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-semibold text-foreground">
                  Room Lobby
                </h2>
                <p className="text-xs text-muted-foreground">
                  Waiting for players to join
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 sm:p-4 border-b border-border">
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm sm:text-base font-medium text-foreground">
              Players ({members.length}/{maxPlayers})
            </h3>
          </div>
          <div className="space-y-2">
            {[...members, ...Array(maxPlayers - members.length).fill(null)].map(
              (player: User | null, index) => (
                <div
                  key={`player-${index}`}
                  className={cn(
                    "flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-lg sm:rounded-xl border transition-all duration-300 ease-in-out min-h-[50px] sm:min-h-[60px]",
                    player
                      ? "bg-card dark:bg-input border-border/60 dark:border-border/90 hover:bg-accent/30 dark:hover:bg-input/30"
                      : "bg-muted/40 border-dashed border-border/60 opacity-80 animate-pulse"
                  )}
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                    <UserIcon className="w-3 h-3 sm:w-4 sm:h-4 text-accent-foreground" />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
                        {player ? player.username : "Waiting..."}
                      </span>
                      {player && room?.host === player.id && (
                        <CrownIcon className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-chart-5 flex-shrink-0" />
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

        <div className="p-3 sm:p-4">
          <div className="flex items-center gap-2 mb-3">
            <SettingsIcon className="w-3 h-3 sm:w-4 sm:h-4 text-muted-foreground" />
            <h3 className="text-sm sm:text-base font-medium text-foreground">
              Game Settings
            </h3>
          </div>
          <div className="space-y-2 sm:space-y-3 mb-4">
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

          <div className="space-y-2">
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 flex items-center gap-1 text-sm"
                onClick={handleInvite}
              >
                <QrCodeIcon className="w-3 h-3" />
                <span>QR Code</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 flex items-center gap-1 text-sm"
                onClick={handleCopyRoomInviteLink}
              >
                {copied ? (
                  <CopyCheckIcon className="w-3 h-3 text-green-600 dark:text-green-300" />
                ) : (
                  <CopyIcon className="w-3 h-3" />
                )}
                <span className="sm:hidden">
                  {copied ? "Copied!" : "Invite Link"}
                </span>
                <span className="hidden sm:inline">
                  {copied ? "Copied!" : "Copy Invite Link"}
                </span>
              </Button>
            </div>
            {isHost() && (
              <Button
                variant="default"
                size="sm"
                className="w-full flex items-center justify-center gap-1 text-sm"
                onClick={handleStart}
                disabled={!canStartGame() || isStarting}
              >
                <PlayIcon className="w-3 h-3" />
                {isStarting && gameStartingCountdown !== null
                  ? `Starting in ${gameStartingCountdown}...`
                  : "Start Game"}
              </Button>
            )}
          </div>
        </div>
      </Card>

      <QRCodeShareModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        inviteLink={inviteLink}
      />
    </div>
  );
}
