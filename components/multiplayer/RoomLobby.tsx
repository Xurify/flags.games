import React from "react";
import {
  CrownIcon,
  UserIcon,
  LinkIcon,
  PlayIcon,
  Users,
  Timer,
  BarChart,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SettingsSelect } from "./SettingsSelect";
import {
  DIFFICULTY_LEVELS,
  ROOM_SIZES,
  TIME_PER_QUESTION_OPTIONS,
} from "@/lib/constants";
import { cn } from "@/lib/utils/strings";
import { RoomSettings, Room, User } from "@/lib/types/socket";

interface RoomLobbyProps {
  room: Room;
  isHost: () => boolean;
  canStartGame: () => boolean;
  updateRoomSettings: (settings: RoomSettings) => void;
}

const RoomLobby: React.FC<RoomLobbyProps> = ({
  room,
  isHost,
  canStartGame,
  updateRoomSettings,
}) => {
  const members = room.members;
  const maxPlayers = room.settings.maxRoomSize;

  const handleSettingChange = (
    key: keyof typeof room.settings,
    value: any
  ) => {
    if (isHost()) {
      updateRoomSettings({ ...room.settings, [key]: value });
    }
  };

  const handleStart = () => {
    // TODO: Implement start game logic via socket
  };

  const handleInvite = () => {
    const inviteLink = room.inviteCode
      ? `${window.location.origin}/lobby?c=${room.inviteCode}`
      : "";
    if (inviteLink) navigator.clipboard.writeText(inviteLink);
    toast.success("Copied invited url");
  };

  return (
    <div className="flex items-center justify-center">
      <Card className="w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden">
        <div className="lg:w-2/5 flex flex-col items-center justify-center px-6 lg:px-8 gap-6 lg:gap-8 border-b lg:border-b-0 lg:border-r border-border">
          <h2 className="text-lg font-semibold text-primary mb-2 tracking-tight">
            Players ({members.length}/{maxPlayers})
          </h2>
          <div className="flex flex-col gap-4 lg:gap-5 w-full">
            {[
              ...members,
              ...Array(maxPlayers - members.length).fill(null),
            ].map((player: User | null, index) => (
              <div
                key={`player-${index}`}
                className={cn(
                  "flex items-center gap-4 lg:gap-5 px-3 lg:px-4 py-3 rounded-2xl shadow-card bg-white/70 dark:bg-black/40 border border-border dark:border-border/70 transition-all",
                  !player &&
                    "opacity-60 bg-muted/60 dark:bg-muted/30 border-dashed"
                )}
              >
                <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full bg-accent dark:bg-accent/40 flex items-center justify-center border-2 border-accent/40 dark:border-accent/30 flex-shrink-0">
                  <UserIcon className="w-6 h-6 lg:w-7 lg:h-7 text-muted-foreground dark:text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block font-semibold text-foreground dark:text-foreground truncate text-sm lg:text-base">
                    {player ? player.username : "Waiting..."}
                  </span>
                  {player && (
                    <span className="block text-xs text-muted-foreground dark:text-muted-foreground truncate">
                      {room?.host === player.id ? "Host" : "Player"}
                    </span>
                  )}
                </div>
                {player && room?.host === player.id && (
                  <CrownIcon
                    className="w-4 h-4 lg:w-5 lg:h-5 text-yellow-400 flex-shrink-0"
                    aria-label="Host"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="text-sm text-muted-foreground mb-4 lg:mb-0 text-center">
            {members.length < maxPlayers
              ? `Waiting for ${maxPlayers - members.length} more player${
                  maxPlayers - members.length > 1 ? "s" : ""
                }...`
              : "Room is full!"}
          </div>
        </div>
        <div className="lg:w-3/5 flex flex-col justify-between px-6 lg:px-10 gap-8 lg:gap-10">
          <div>
            <h2 className="text-lg font-semibold text-primary mb-4 lg:mb-6 tracking-tight text-center lg:text-left">
              Game Settings
            </h2>
            <div className="space-y-2">
              <SettingsSelect
                icon={<Users className="w-5 h-5" />}
                label="Max Players"
                value={room.settings.maxRoomSize}
                options={ROOM_SIZES.map((size) => ({
                  value: size,
                  label: `${size} players`,
                }))}
                onValueChange={(value) => {
                  // TODO: Implement this in the backend
                  if (members.length > value) {
                    toast.error("Cannot reduce max players below current number of players");
                    return;
                  }
                  return handleSettingChange("maxRoomSize", value);
                }}
                renderValue={(value) => `${value} players`}
                disabled={!isHost()}
              />
              <SettingsSelect
                icon={<BarChart className="w-5 h-5" />}
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
                disabled={!isHost()}
              />
              <SettingsSelect
                icon={<Timer className="w-5 h-5" />}
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
                disabled={!isHost()}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center">
            <Button
              variant="outline"
              className="flex items-center gap-2 h-12 px-6 text-base w-full sm:w-auto"
              onClick={handleInvite}
            >
              <LinkIcon className="w-5 h-5" /> Invite
            </Button>
            {isHost() && (
              <Button
                variant="default"
                className="flex items-center gap-2 h-12 px-6 text-base w-full sm:w-auto"
                onClick={handleStart}
                disabled={!canStartGame()}
              >
                <PlayIcon className="w-5 h-5" /> Start
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default RoomLobby;