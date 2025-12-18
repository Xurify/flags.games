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
  LogOutIcon,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
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
    <div className="flex flex-col gap-8 w-full max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-5xl font-black tracking-tighter text-foreground uppercase">
            Lobby
          </h1>
          <p className="font-mono text-sm text-muted-foreground uppercase tracking-widest mt-1">
            Waiting for players to join
          </p>
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="font-mono text-[10px] uppercase font-bold text-muted-foreground mr-1">Invite Code</span>
          <Button
            variant="outline"
            onClick={handleCopyRoomInviteLink}
            className="font-mono font-bold text-xl border-2 border-foreground shadow-retro h-auto py-2 px-4 hover:bg-muted active:translate-x-0.5 active:translate-y-0.5"
          >
            {room.inviteCode}
            {copied ? <CopyCheckIcon className="ml-2 w-4 h-4 text-primary" /> : <CopyIcon className="ml-2 w-4 h-4 opacity-40" />}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b-2 border-foreground pb-2">
            <h2 className="text-xl font-black tracking-tight">PLAYERS</h2>
            <Badge variant="outline" className="font-bold border-foreground">
              {members.length}/{maxPlayers}
            </Badge>
          </div>

          <div className="grid gap-3">
            {[...members, ...Array(maxPlayers - members.length).fill(null)].map(
              (player: User | null, index) => (
                <div
                  key={`player-${index}`}
                  className={cn(
                    "flex items-center gap-4 p-4 border-2 transition-all rounded-sm",
                    player
                      ? "bg-background border-foreground shadow-retro"
                      : "bg-muted/10 border-foreground/10 border-dashed opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 border-2 flex items-center justify-center font-black",
                    player ? "bg-secondary text-secondary-foreground border-foreground" : "bg-muted/20 border-foreground/10"
                  )}>
                    {player ? player.username.charAt(0).toUpperCase() : "?"}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-foreground truncate">
                        {player ? player.username : "EMPTY SLOT"}
                      </span>
                      {player && room?.host === player.id && (
                        <div className="bg-foreground text-background text-[9px] px-1.5 py-0.5 font-black uppercase tracking-tighter leading-none">
                          HOST
                        </div>
                      )}
                    </div>
                  </div>

                  {player && room?.host !== player.id && isHost() && (
                    <Button
                      variant="ghost"
                      onClick={() => useRoomManagement().kickUser(player.id)}
                      className="text-[10px] h-6 px-2 hover:bg-destructive hover:text-white border-transparent hover:border-foreground"
                    >
                      KICK
                    </Button>
                  )}
                </div>
              )
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center border-b-2 border-foreground pb-2">
            <h2 className="text-xl font-black tracking-tight uppercase">Match Settings</h2>
          </div>

          <div className="bg-muted/20 border-2 border-foreground p-4 space-y-4 shadow-retro">
            <SettingsSelect
              icon={<UsersIcon className="w-4 h-4" />}
              label="Players"
              value={room.settings.maxRoomSize}
              options={ROOM_SIZES.map((size) => ({
                value: size,
                label: `${size} Players`,
              }))}
              onValueChange={(value) => {
                if (members.length > value) {
                  toast.error("Can't reduce below current count");
                  return;
                }
                return handleSettingChange("maxRoomSize", value);
              }}
              renderValue={(value) => `${value} Players`}
              disabled={!isHost() || isStarting}
            />

            <SettingsSelect
              icon={<BarChartIcon className="w-4 h-4" />}
              label="Difficulty"
              value={room.settings.difficulty}
              options={DIFFICULTY_LEVELS.map((level) => ({
                value: level,
                label: level.charAt(0).toUpperCase() + level.slice(1),
              }))}
              onValueChange={(value) => handleSettingChange("difficulty", value)}
              renderValue={(value) => value.toUpperCase()}
              disabled={!isHost() || isStarting}
            />

            <SettingsSelect
              icon={<TimerIcon className="w-4 h-4" />}
              label="Speed"
              value={room.settings.timePerQuestion}
              options={TIME_PER_QUESTION_OPTIONS.map((time) => ({
                value: time,
                label: `${time} seconds`,
              }))}
              onValueChange={(value) => handleSettingChange("timePerQuestion", value)}
              renderValue={(value) => `${value}s`}
              disabled={!isHost() || isStarting}
            />
          </div>

          <div className="pt-4 space-y-3">
            {isHost() ? (
              <Button
                variant="default"
                size="lg"
                className="w-full h-16 text-xl tracking-tighter bg-primary hover:bg-primary/90 text-white border-2 border-foreground shadow-retro active:translate-x-0.5 active:translate-y-0.5"
                onClick={handleStart}
                disabled={!canStartGame() || isStarting}
              >
                {isStarting ? `STARTING IN ${gameStartingCountdown}...` : "START MATCH"}
              </Button>
            ) : (
              <div className="p-4 bg-muted/10 border-2 border-foreground border-dashed text-center font-mono text-sm opacity-60">
                {isStarting ? "PREPARING MATCH..." : "WAITING FOR HOST TO START"}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 font-bold tracking-tight h-10"
                onClick={handleInvite}
              >
                <QrCodeIcon className="w-4 h-4 mr-2" />
                SHOW QR
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 font-bold tracking-tight h-10"
                onClick={() => {
                  navigator.clipboard.writeText(inviteLink);
                  toast.success("Invite link copied to clipboard!");
                }}
              >
                <CopyIcon className="w-4 h-4 mr-2" />
                COPY LINK
              </Button>
            </div>

            <Link href="/" className="block pt-2">
              <Button
                variant="ghost"
                size="sm"
                className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 font-bold tracking-tight h-10 uppercase"
              >
                <LogOutIcon className="w-4 h-4 mr-2" />
                Leave Match
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <QRCodeShareModal
        isOpen={showQRModal}
        onClose={() => setShowQRModal(false)}
        inviteLink={inviteLink}
      />
    </div>
  );
}
