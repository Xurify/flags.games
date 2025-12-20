"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  UsersIcon,
  TimerIcon,
  BarChartIcon,
  CopyIcon,
  CopyCheckIcon,
  QrCodeIcon,
  LogOutIcon,
  ArrowLeftIcon,
} from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

function useRoomLobbyLogic(room: Room) {
  const { currentRoom } = useSocket();
  const { isHost, canStartGame, startGame, updateRoomSettings, kickUser } =
    useRoomManagement();
  const { settings } = useSettings();

  const [gameStartingCountdown, setGameStartingCountdown] = useState<
    number | null
  >(null);
  const [isStarting, setIsStarting] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);

  const [copied, setCopied] = React.useState(false);
  const copiedTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const inviteLink = room.inviteCode
    ? `${window.location.origin}/lobby?c=${room.inviteCode}`
    : "";

  const handleCopyRoomInviteLink = () => {
    if (copiedTimeoutRef.current) {
      clearTimeout(copiedTimeoutRef.current);
      copiedTimeoutRef.current = null;
    }
    if (room.inviteCode) {
      navigator.clipboard.writeText(inviteLink);
      toast.success("Invite link copied to clipboard");
      setCopied(true);
      copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    }
  };

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

  const handleStart = () => {
    setIsStarting(true);
    setGameStartingCountdown(5);
    startGame();
  };

  const handleSettingChange = (key: keyof typeof room.settings, value: any) => {
    if (isHost()) {
      updateRoomSettings({ ...room.settings, [key]: value });
    }
  };

  return {
    isHost: isHost(),
    isStarting,
    gameStartingCountdown,
    canStartGame: canStartGame(),
    handleStart,
    handleSettingChange,
    handleCopyRoomInviteLink,
    copied,
    inviteLink,
    showQRModal,
    setShowQRModal,
    kickUser,
  };
}

const PlayerList = ({
  members,
  maxPlayers,
  hostId,
  currentUserId,
  isHost,
  onKick,
}: {
  members: User[];
  maxPlayers: number;
  hostId: string;
  currentUserId?: string;
  isHost: boolean;
  onKick: (id: string) => void;
}) => (
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
            <div
              className={cn(
                "w-10 h-10 border-2 flex items-center justify-center font-black",
                player
                  ? "bg-secondary text-secondary-foreground border-foreground"
                  : "bg-muted/20 border-foreground/10"
              )}
            >
              {player ? player.username.charAt(0).toUpperCase() : "?"}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground truncate">
                  {player ? player.username : "EMPTY SLOT"}
                </span>
                {player && hostId === player.id && (
                  <div className="bg-foreground text-background text-[9px] px-1.5 py-0.5 font-black uppercase tracking-tighter leading-none">
                    HOST
                  </div>
                )}
              </div>
            </div>

            {player && hostId !== player.id && isHost && (
              <Button
                variant="ghost"
                onClick={() => onKick(player.id)}
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
);

const MatchSettings = ({
  settings,
  membersCount,
  isHost,
  isStarting,
  onSettingChange,
}: {
  settings: Room["settings"];
  membersCount: number;
  isHost: boolean;
  isStarting: boolean;
  onSettingChange: (key: any, value: any) => void;
}) => (
  <div className="space-y-4">
    <div className="flex items-center border-b-2 border-foreground pb-2">
      <h2 className="text-xl font-black tracking-tight uppercase">
        Match Settings
      </h2>
    </div>

    <div className="bg-muted/20 border-2 border-foreground p-4 space-y-4 shadow-retro">
      <SettingsSelect
        icon={<UsersIcon className="w-4 h-4" />}
        label="Players"
        value={settings.maxRoomSize}
        options={ROOM_SIZES.map((size) => ({
          value: size,
          label: `${size} Players`,
        }))}
        onValueChange={(value) => {
          if (membersCount > value) {
            toast.error("Can't reduce below current count");
            return;
          }
          return onSettingChange("maxRoomSize", value);
        }}
        renderValue={(value) => `${value} Players`}
        disabled={!isHost || isStarting}
      />

      <SettingsSelect
        icon={<BarChartIcon className="w-4 h-4" />}
        label="Difficulty"
        value={settings.difficulty}
        options={DIFFICULTY_LEVELS.map((level) => ({
          value: level,
          label: level.charAt(0).toUpperCase() + level.slice(1),
        }))}
        onValueChange={(value) => onSettingChange("difficulty", value)}
        renderValue={(value) => value.toUpperCase()}
        disabled={!isHost || isStarting}
      />

      <SettingsSelect
        icon={<TimerIcon className="w-4 h-4" />}
        label="Speed"
        value={settings.timePerQuestion}
        options={TIME_PER_QUESTION_OPTIONS.map((time) => ({
          value: time,
          label: `${time} seconds`,
        }))}
        onValueChange={(value) => onSettingChange("timePerQuestion", value)}
        renderValue={(value) => `${value}s`}
        disabled={!isHost || isStarting}
      />
    </div>
  </div>
);

export default function RoomLobby({ room }: RoomLobbyProps) {
  const logic = useRoomLobbyLogic(room);
  const { currentUser } = useSocket();

  return (
    <div className="flex flex-col gap-10 w-full max-w-4xl mx-auto">
      <div className="flex flex-col gap-4 border-b-4 border-foreground pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              href="/"
              className="group flex items-center justify-center w-9 h-9 sm:w-12 sm:h-12 border-2 border-foreground shadow-retro hover:bg-destructive transition-all active:translate-y-0.5 active:shadow-none"
              title="Leave Match"
            >
              <ArrowLeftIcon className="w-4 h-4 sm:w-6 sm:h-6 group-hover:text-white" />
            </Link>
            <div className="flex flex-col">
              <h1 className="text-3xl sm:text-6xl font-black tracking-tighter uppercase leading-none">
                Lobby
              </h1>
              <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-widest mt-1">
                Waiting for players to join
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-0.5">
            <span className="font-mono text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none">
              Session ID
            </span>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-3xl font-black font-mono tracking-tighter text-primary">
                {room.inviteCode}
              </span>
              <button
                onClick={logic.handleCopyRoomInviteLink}
                className="opacity-30 hover:opacity-100 transition-opacity p-1"
                title="Copy Invite Link"
              >
                {logic.copied ? (
                  <CopyCheckIcon className="w-4 h-4 text-green-600" />
                ) : (
                  <CopyIcon className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <PlayerList
          members={room.members}
          maxPlayers={room.settings.maxRoomSize}
          hostId={room.host}
          currentUserId={currentUser?.id}
          isHost={logic.isHost}
          onKick={logic.kickUser}
        />

        <div className="space-y-4">
          <MatchSettings
            settings={room.settings}
            membersCount={room.members.length}
            isHost={logic.isHost}
            isStarting={logic.isStarting}
            onSettingChange={logic.handleSettingChange}
          />

          <div className="pt-4 space-y-3">
            {logic.isHost ? (
              <Button
                variant="default"
                size="lg"
                className="w-full h-16 text-xl tracking-tighter bg-primary hover:bg-primary/90 text-white border-2 border-foreground shadow-retro active:translate-x-0.5 active:translate-y-0.5"
                onClick={logic.handleStart}
                disabled={!logic.canStartGame || logic.isStarting}
              >
                {logic.isStarting
                  ? `STARTING IN ${logic.gameStartingCountdown}...`
                  : "START MATCH"}
              </Button>
            ) : (
              <div className="p-4 bg-muted/10 border-2 border-foreground border-dashed text-center font-mono text-sm opacity-60">
                {logic.isStarting
                  ? "PREPARING MATCH..."
                  : "WAITING FOR HOST TO START"}
              </div>
            )}

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 font-bold tracking-tight h-10"
                onClick={() => logic.setShowQRModal(true)}
              >
                <QrCodeIcon className="w-4 h-4 mr-2" />
                SHOW QR
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 font-bold tracking-tight h-10"
                onClick={() => {
                  navigator.clipboard.writeText(logic.inviteLink);
                  toast.success("Invite link copied to clipboard!");
                }}
              >
                <CopyIcon className="w-4 h-4 mr-2" />
                COPY LINK
              </Button>
            </div>

            <Link href="/" className="md:block pt-2">
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
        isOpen={logic.showQRModal}
        onClose={() => logic.setShowQRModal(false)}
        inviteLink={logic.inviteLink}
      />
    </div>
  );
}
