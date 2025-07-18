"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";
import {
  UsersIcon,
  SettingsIcon,
  CrownIcon,
  UserIcon,
  CheckIcon,
  PlayIcon,
  LinkIcon,
} from "lucide-react";
import { toast } from "sonner";

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
import {
  Difficulty,
  DIFFICULTY_LEVELS,
  ROOM_SIZES,
  TIME_PER_QUESTION_OPTIONS,
} from "@/lib/constants";
import { cn } from "@/lib/utils/strings";
import { useRoomManagement } from "@/lib/hooks/useRoomManagement";
import { GameMode, RoomSettings, User } from "@/lib/types/multiplayer";

const roomSettingsSchema = z.object({
  maxRoomSize: z
    .number()
    .min(2)
    .max(ROOM_SIZES[ROOM_SIZES.length - 1]),
  difficulty: z.enum(DIFFICULTY_LEVELS),
  gameMode: z.string(),
  timePerQuestion: z.number().min(10).max(60),
});

const formSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  settings: roomSettingsSchema,
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

  const handleCreateRoom = async () => {
    const finalUsername = username.trim() || randomUsername;
    const result = formSchema.safeParse({ username: finalUsername, settings });
    if (!result.success) {
      const errors: { username?: string; settings?: string } = {};
      result.error.issues.forEach((error) => {
        if (error.path[0] === "username") errors.username = error.message;
        if (error.path[0] === "settings") errors.settings = error.message;
      });
      setFormErrors(errors);
      return;
    }
    setFormErrors({});
    setIsCreating(true);
    await createRoom(finalUsername, settings);
    setIsCreating(false);
  };

  if (inviteCode) {
    const handleJoinRoom = async () => {
      const finalUsername = username.trim() || randomUsername;
      const result = formSchema.safeParse({
        username: finalUsername,
        settings,
      });
      if (!result.success) {
        const errors: { username?: string; settings?: string } = {};
        result.error.issues.forEach((error) => {
          if (error.path[0] === "username") errors.username = error.message;
        });
        setFormErrors(errors);
        return;
      }
      setFormErrors({});
      setIsJoining(true);
      inviteCode && (await joinRoom(inviteCode, username));
      setIsJoining(false);
    };

    return (
      <div className="max-w-lg w-full mx-auto">
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardHeader>
            <CardTitle className="text-center flex items-center justify-center gap-2 font-semibold">
              <UsersIcon className="w-5 h-5 text-primary" />
              Join Room
            </CardTitle>
            <CardDescription className="text-center">
              Join a new multiplayer game room with you and your friends
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">
                Username
              </Label>
              <Input
                id="username"
                placeholder={randomUsername}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11 rounded-xl"
                maxLength={30}
              />
              {formErrors.username && (
                <p className="text-xs text-red-500">{formErrors.username}</p>
              )}
              <p className="text-xs text-muted-foreground">
                {username.length}/30 characters
              </p>
            </div>

            <Button
              onClick={handleJoinRoom}
              disabled={isJoining}
              className="w-full"
              size="lg"
            >
              {isJoining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Joining Room...
                </>
              ) : (
                "Join Room"
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (room && room.settings) {
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
            <div className="text-sm text-muted-foreground mt-4 text-center">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                <div>
                  <Label htmlFor="difficulty" className="text-sm font-medium">
                    Difficulty
                  </Label>
                  <Select
                    value={room.settings.difficulty}
                    onValueChange={(v) => handleSettingChange("difficulty", v)}
                    disabled={!isHost()}
                    variant="neutral"
                  >
                    <SelectTrigger className="h-12 rounded-xl mt-2 capitalize">
                      <SelectValue>{room.settings.difficulty}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {DIFFICULTY_LEVELS.map((difficulty) => (
                        <SelectItem
                          className="capitalize"
                          key={difficulty}
                          value={difficulty}
                        >
                          {difficulty}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="roomSize" className="text-sm font-medium">
                    Max Players
                  </Label>
                  <Select
                    value={String(room.settings.maxRoomSize)}
                    variant="neutral"
                    onValueChange={(v) =>
                      handleSettingChange("maxRoomSize", Number(v))
                    }
                    disabled={!isHost()}
                  >
                    <SelectTrigger className="h-12 rounded-xl mt-2">
                      <SelectValue>
                        {room.settings.maxRoomSize} players
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {ROOM_SIZES.map((n) => (
                        <SelectItem key={n} value={n.toString()}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label
                    htmlFor="timePerQuestion"
                    className="text-sm font-medium"
                  >
                    Time per Question (seconds)
                  </Label>
                  <Select
                    variant="neutral"
                    value={String(room.settings.timePerQuestion)}
                    onValueChange={(v) =>
                      handleSettingChange("timePerQuestion", Number(v))
                    }
                    disabled={!isHost()}
                  >
                    <SelectTrigger className="h-12 rounded-xl mt-2">
                      <SelectValue>{room.settings.timePerQuestion}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {TIME_PER_QUESTION_OPTIONS.map((time) => (
                        <SelectItem key={time} value={time.toString()}>
                          {time} seconds
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-6 justify-center items-center mt-6 lg:mt-8">
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
  }

  return (
    <div className="max-w-lg w-full mx-auto">
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2 font-semibold">
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
              placeholder={randomUsername}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 rounded-xl"
              maxLength={30}
            />
            {formErrors.username && (
              <p className="text-xs text-red-500">{formErrors.username}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {username.length}/30 characters
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              Game Settings
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2 h-[64px]">
                <Label htmlFor="maxPlayers" className="text-sm font-medium">
                  Max Players
                </Label>
                <Select
                  value={settings.maxRoomSize.toString()}
                  variant="neutral"
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      maxRoomSize: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue>{settings.maxRoomSize} players</SelectValue>
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
              <div className="space-y-2 h-[64px]">
                <Label htmlFor="difficulty" className="text-sm font-medium">
                  Difficulty
                </Label>
                <Select
                  value={settings.difficulty}
                  variant="neutral"
                  onValueChange={(value: Difficulty) =>
                    setSettings((prev) => ({
                      ...prev,
                      difficulty: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl capitalize">
                    <SelectValue className="capitalize">
                      {settings.difficulty}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {DIFFICULTY_LEVELS.map((difficulty) => (
                      <SelectItem
                        className="capitalize"
                        key={difficulty}
                        value={difficulty}
                      >
                        {difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 h-[64px]">
                <Label
                  htmlFor="timePerQuestion"
                  className="text-sm font-medium"
                >
                  Time per Question (seconds)
                </Label>
                <Select
                  value={settings.timePerQuestion?.toString()}
                  variant="neutral"
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      timePerQuestion: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl">
                    <SelectValue>{settings.timePerQuestion}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {TIME_PER_QUESTION_OPTIONS.map((time) => (
                      <SelectItem key={time} value={time.toString()}>
                        {time} seconds
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 h-[64px]">
                <Label htmlFor="gameMode" className="text-sm font-medium">
                  Game Mode
                </Label>
                <Select
                  value={settings.gameMode}
                  variant="neutral"
                  onValueChange={(value: GameMode) =>
                    setSettings((prev) => ({
                      ...prev,
                      gameMode: value,
                    }))
                  }
                >
                  <SelectTrigger className="h-11 rounded-xl capitalize">
                    <SelectValue>{settings.gameMode}</SelectValue>
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
              disabled={isCreating}
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
