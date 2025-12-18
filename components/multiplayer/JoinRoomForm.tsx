import React from "react";
import Link from "next/link";
import { z } from "zod";
import { ArrowLeft, UsersIcon } from "lucide-react";

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
    <div className="w-full">
      <div className="space-y-4">
        <section className="space-y-3">
          <div className="flex items-center gap-4 border-b-2 border-foreground pb-2">
            <Link href="/" className="w-8 h-8 bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors flex items-center justify-center font-black cursor-pointer shadow-retro-sm active:translate-y-0.5 active:shadow-none" title="Back to Home">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h2 className="text-2xl font-black tracking-tight uppercase">Join Match</h2>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-muted/20 border-2 border-foreground shadow-retro">
              <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground mb-2">
                Match Info: <span className="text-foreground font-bold">{settings.maxRoomSize} PLAYERS</span> | <span className="text-foreground font-bold">{settings.difficulty.toUpperCase()}</span>
              </p>

              <div className="space-y-2">
                <Label htmlFor="username" className="font-mono text-[10px] uppercase font-bold text-muted-foreground ml-1">
                  Your Username
                </Label>
                <Input
                  id="username"
                  placeholder={randomUsername}
                  value={username}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUsername(e.target.value)
                  }
                  className="h-14 text-xl font-bold border-2 border-foreground shadow-retro bg-background focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:border-primary transition-all px-4"
                  maxLength={30}
                />
                {formErrors.username && (
                  <p className="text-xs text-destructive font-bold uppercase mt-1">{formErrors.username}</p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSubmit}
                disabled={isButtonDisabled}
                className="w-full h-20 text-2xl font-black tracking-tighter shadow-retro border-2 border-foreground active:translate-x-1 active:translate-y-1 active:shadow-none transition-all uppercase"
                size="lg"
              >
                {buttonLabel}
              </Button>

              <div className="flex justify-center pt-2">
                <Link href="/">
                  <Button variant="ghost" size="sm" className="text-muted-foreground hover:bg-primary/5 hover:text-primary transition-all font-mono text-xs uppercase tracking-widest">
                    &larr; Back to Home
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default JoinRoomForm;
