import React from "react";
import { z } from "zod";
import {
  SettingsIcon,
  UsersIcon,
  TimerIcon,
  BarChartIcon,
  SwordsIcon,
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
import { SettingsSelect } from "./SettingsSelect";
import {
  Difficulty,
  DIFFICULTY_LEVELS,
  ROOM_SIZES,
  TIME_PER_QUESTION_OPTIONS,
} from "@/lib/constants";
import { RoomSettings } from "@/lib/types/socket";

const roomSettingsSchema = z.object({
  maxRoomSize: z
    .number()
    .min(2)
    .max(ROOM_SIZES[ROOM_SIZES.length - 1]),
  difficulty: z.enum(DIFFICULTY_LEVELS),
  gameMode: z.string(),
  timePerQuestion: z.number().min(10).max(30),
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
  handleCreateRoom: (
    finalUsername: string,
    settings: RoomSettings
  ) => Promise<void>;
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
      <Card className="transition-all duration-300">
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
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

            <div className="space-y-2">
              <SettingsSelect
                icon={<UsersIcon className="w-5 h-5" />}
                label="Max Players"
                value={settings.maxRoomSize}
                options={ROOM_SIZES.map((size) => ({
                  value: size,
                  label: `${size} players`,
                }))}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, maxRoomSize: value }))
                }
                renderValue={(value) => `${value} players`}
              />
              <SettingsSelect
                icon={<BarChartIcon className="w-5 h-5" />}
                label="Difficulty"
                value={settings.difficulty}
                options={DIFFICULTY_LEVELS.map((level) => ({
                  value: level,
                  label: level.charAt(0).toUpperCase() + level.slice(1),
                }))}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, difficulty: value }))
                }
                renderValue={(value) =>
                  value.charAt(0).toUpperCase() + value.slice(1)
                }
              />
              <SettingsSelect
                icon={<TimerIcon className="w-5 h-5" />}
                label="Time per Question"
                value={settings.timePerQuestion ?? TIME_PER_QUESTION_OPTIONS[1]}
                options={TIME_PER_QUESTION_OPTIONS.map((time) => ({
                  value: time,
                  label: `${time} seconds`,
                }))}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, timePerQuestion: value }))
                }
                renderValue={(value) => `${value}s`}
              />
              <SettingsSelect
                icon={<SwordsIcon className="w-5 h-5" />}
                label="Game Mode"
                value={settings.gameMode}
                options={[
                  { value: "classic", label: "Classic" },
                  {
                    value: "speed",
                    label: "Speed Round (soon)",
                    disabled: true,
                  },
                  {
                    value: "elimination",
                    label: "Elimination (soon)",
                    disabled: true,
                  },
                ]}
                onValueChange={(value) =>
                  setSettings((prev) => ({ ...prev, gameMode: value }))
                }
                renderValue={(value) =>
                  value.charAt(0).toUpperCase() + value.slice(1)
                }
              />
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
