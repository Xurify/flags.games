import React from "react";
import { z } from "zod";
import { SettingsIcon, UsersIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { GameMode, RoomSettings } from "@/lib/types/socket";

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

interface CreateRoomFormProps {
  randomUsername: string;
  username: string;
  setUsername: (username: string) => void;
  settings: RoomSettings;
  setSettings: React.Dispatch<React.SetStateAction<RoomSettings>>;
  isCreating: boolean;
  handleCreateRoom: (finalUsername: string, settings: RoomSettings) => Promise<void>;
  formErrors: { username?: string; settings?: string };
}

const CreateRoomForm: React.FC<CreateRoomFormProps> = ({
  randomUsername,
  username,
  setUsername,
  settings,
  setSettings,
  isCreating,
  handleCreateRoom,
  formErrors,
}) => {
  const handleSubmit = async () => {
    const finalUsername = username.trim() || randomUsername;
    const result = formSchema.safeParse({ username: finalUsername, settings });
    if (!result.success) {
      const errors: { username?: string; settings?: string } = {};
      result.error.issues.forEach((error) => {
        if (error.path[0] === "username") errors.username = error.message;
        if (error.path[0] === "settings") errors.settings = error.message;
      });
      return;
    }
    await handleCreateRoom(finalUsername, settings);
  };

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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
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
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      maxRoomSize: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger variant="neutral" className="h-11 rounded-xl">
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
                  onValueChange={(value: Difficulty) =>
                    setSettings((prev) => ({
                      ...prev,
                      difficulty: value,
                    }))
                  }
                >
                  <SelectTrigger variant="neutral" className="h-11 rounded-xl capitalize">
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
                  onValueChange={(value) =>
                    setSettings((prev) => ({
                      ...prev,
                      timePerQuestion: parseInt(value),
                    }))
                  }
                >
                  <SelectTrigger variant="neutral" className="h-11 rounded-xl">
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
                  onValueChange={(value: GameMode) =>
                    setSettings((prev) => ({
                      ...prev,
                      gameMode: value,
                    }))
                  }
                >
                  <SelectTrigger variant="neutral" className="h-11 rounded-xl capitalize">
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
              onClick={handleSubmit}
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

export default CreateRoomForm;