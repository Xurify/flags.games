import React from "react";
import Link from "next/link";
import { z } from "zod";
import { UsersIcon, TimerIcon, BarChartIcon, SwordsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SettingsSelect } from "./SettingsSelect";
import { DIFFICULTY_LEVELS, ROOM_SIZES, TIME_PER_QUESTION_OPTIONS } from "@/lib/constants";
import { RoomSettings } from "@/lib/types/socket";
import { useConnectionStatus } from "@/lib/hooks/useConnectionStatus";

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
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters"),
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
  const { isConnected, isConnecting, isReconnecting } = useConnectionStatus();

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

  const isSocketBusy = !isConnected || isConnecting || isReconnecting;
  const isButtonDisabled = isCreating || isSocketBusy;

  let buttonLabel: React.ReactNode = "Create Room";
  const spinner = (
    <div className="w-4 h-4 min-w-4 min-h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
  );

  if (isCreating) {
    buttonLabel = (
      <>
        {spinner}
        Creating Room...
      </>
    );
  } else if (isConnecting || isReconnecting || !isConnected) {
    buttonLabel = (
      <>
        {spinner}
        Connecting to server...
      </>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="space-y-6 sm:space-y-4">
        <section className="space-y-4 sm:space-y-3">
          <div className="flex items-center gap-4 border-b-2 border-foreground pb-2 mb-2">
            <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-black">
              1
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">Player Info</h2>
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="username"
              className="font-mono text-[10px] uppercase font-bold text-muted-foreground ml-1"
            >
              Your Username
            </Label>
            <Input
              id="username"
              placeholder={randomUsername}
              value={username}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
              className="h-12 sm:h-14 text-lg sm:text-xl font-bold border-2 border-foreground shadow-retro bg-background focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-all px-4"
              maxLength={30}
            />
            {formErrors.username && (
              <p className="text-xs text-destructive font-bold uppercase mt-1">
                {formErrors.username}
              </p>
            )}
            <p className="font-mono text-[10px] text-muted-foreground text-right uppercase mt-1">
              Length: {username.length}/30
            </p>
          </div>
        </section>

        <section className="space-y-3">
          <div className="flex items-center gap-4 border-b-2 border-foreground pb-2">
            <div className="w-8 h-8 bg-foreground text-background flex items-center justify-center font-black">
              2
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight uppercase">
              Match Settings
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-muted/20 border-2 border-foreground p-4 sm:p-6 shadow-retro">
            <SettingsSelect
              icon={<UsersIcon className="w-4 h-4" />}
              label="Players"
              value={settings.maxRoomSize}
              options={ROOM_SIZES.map((size) => ({
                value: size,
                label: `${size} Players`,
              }))}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, maxRoomSize: value }))}
              renderValue={(value) => `${value} Players`}
            />
            <SettingsSelect
              icon={<BarChartIcon className="w-4 h-4" />}
              label="Difficulty"
              value={settings.difficulty}
              options={DIFFICULTY_LEVELS.map((level) => ({
                value: level,
                label: level.charAt(0).toUpperCase() + level.slice(1),
              }))}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, difficulty: value }))}
              renderValue={(value) => value.toUpperCase()}
            />
            <SettingsSelect
              icon={<TimerIcon className="w-4 h-4" />}
              label="Speed"
              value={settings.timePerQuestion ?? TIME_PER_QUESTION_OPTIONS[1]}
              options={TIME_PER_QUESTION_OPTIONS.map((time) => ({
                value: time,
                label: `${time} seconds`,
              }))}
              onValueChange={(value) =>
                setSettings((prev) => ({ ...prev, timePerQuestion: value }))
              }
              renderValue={(value) => `${value}S`}
            />
            <SettingsSelect
              icon={<SwordsIcon className="w-4 h-4" />}
              label="Game Mode"
              value={settings.gameMode}
              options={[
                { value: "classic", label: "Classic" },
                {
                  value: "speed",
                  label: "Speed Round",
                  disabled: true,
                },
                {
                  value: "elimination",
                  label: "Elimination",
                  disabled: true,
                },
              ]}
              onValueChange={(value) => setSettings((prev) => ({ ...prev, gameMode: value }))}
              renderValue={(value) => value.toUpperCase()}
            />
          </div>
        </section>

        <div>
          <Button
            onClick={handleSubmit}
            disabled={isButtonDisabled}
            className="w-full h-16 sm:h-20 text-xl sm:text-2xl font-black tracking-tighter shadow-retro border-2 border-foreground active:translate-x-1 active:translate-y-1 active:shadow-none transition-all uppercase"
            size="lg"
          >
            {buttonLabel}
          </Button>

          <div className="flex justify-center pt-2">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all font-mono text-xs uppercase tracking-widest"
              >
                &larr; Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomForm;
