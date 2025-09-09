import React from "react";
import Link from "next/link";
import { z } from "zod";
import { UsersIcon } from "lucide-react";

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
import { RoomSettings } from "@/lib/types/socket";
import { useConnectionStatus } from "@/lib/hooks/useConnectionStatus";

const formSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(30, "Username must be less than 30 characters"),
  settings: z.object({
    maxRoomSize: z.number(),
    difficulty: z.string(),
    gameMode: z.string(),
    timePerQuestion: z.number(),
  }),
});

interface JoinRoomFormProps {
  randomUsername: string;
  username: string;
  setUsername: (username: string) => void;
  isJoining: boolean;
  handleJoinRoom: (finalUsername: string) => Promise<void>;
  formErrors: { username?: string };
  settings: RoomSettings;
}

const JoinRoomForm: React.FC<JoinRoomFormProps> = ({
  randomUsername,
  username,
  setUsername,
  isJoining,
  handleJoinRoom,
  formErrors,
  settings,
}) => {
  const { isConnected, isConnecting, isReconnecting } = useConnectionStatus();

  const handleSubmit = async () => {
    const finalUsername = username.trim() || randomUsername;
    const result = formSchema.safeParse({ username: finalUsername, settings });
    if (!result.success) {
      const errors: { username?: string } = {};
      result.error.issues.forEach((error) => {
        if (error.path[0] === "username") errors.username = error.message;
      });
      return;
    }
    await handleJoinRoom(finalUsername);
  };

  const isSocketBusy = !isConnected || isConnecting || isReconnecting;
  const isButtonDisabled = isJoining || isSocketBusy;

  let buttonLabel: React.ReactNode = "Connect";
  if (isJoining) {
    buttonLabel = (
      <>
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        Connecting...
      </>
    );
  } else if (isConnecting || isReconnecting || !isConnected) {
    buttonLabel = (
      <>
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
        Connecting to server...
      </>
    );
  }

  return (
    <div className="max-w-lg w-full mx-auto">
      <Card>
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
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setUsername(e.target.value)
              }
              className="h-11"
              maxLength={30}
            />
            {formErrors.username && (
              <p className="text-xs text-red-500">{formErrors.username}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {username.length}/30 characters
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button
              onClick={handleSubmit}
              disabled={isButtonDisabled}
              className="w-full"
              size="lg"
            >
              {buttonLabel}
            </Button>
            <Link
              href="/lobby"
              className="text-sm text-muted-foreground text-center"
            >
              Need to create a room instead?{" "}
              <span className="underline text-primary">Click here</span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinRoomForm;
