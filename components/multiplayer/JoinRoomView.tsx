"use client";

import React, { useState } from "react";
import { HashIcon, LogInIcon, UsersIcon } from "lucide-react";
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

interface JoinRoomViewProps {
  onJoinRoom: (inviteCode: string, username: string) => void;
  isJoining?: boolean;
  error?: string;
  onSwitchView: () => void;
}

const JoinRoomView: React.FC<JoinRoomViewProps> = ({
  onJoinRoom,
  isJoining = false,
  error,
  onSwitchView,
}) => {
  const [inviteCode, setInviteCode] = useState("");
  const [username, setUsername] = useState("");

  const handleJoinRoom = () => {
    if (inviteCode.trim() && username.trim()) {
      onJoinRoom(inviteCode.trim().toUpperCase(), username.trim());
    }
  };

  const handleInviteCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 6);
    setInviteCode(value);
  };

  const isFormValid =
    inviteCode.trim().length >= 4 && username.trim().length >= 2;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <Card className="shadow-card hover:shadow-card-hover transition-all duration-300">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center gap-2">
            <UsersIcon className="w-5 h-5 text-primary" />
            Join Game Room
          </CardTitle>
          <CardDescription className="text-center">
            Enter the invite code shared by your friend to join their game
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4">
              <p className="text-sm text-destructive text-center font-medium">
                {error}
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label
              htmlFor="inviteCode"
              className="text-sm font-medium flex items-center gap-2"
            >
              <HashIcon className="w-4 h-4" />
              Invite Code
            </Label>
            <Input
              id="inviteCode"
              placeholder="Invite code"
              value={inviteCode}
              onChange={handleInviteCodeChange}
              className="h-12 rounded-xl text-center text-lg font-mono tracking-wider uppercase"
              maxLength={6}
            />
            <p className="text-xs text-muted-foreground text-center">
              Invite codes are usually 6 characters long
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Your Username
            </Label>
            <Input
              id="username"
              placeholder="Enter your display name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-11 rounded-xl"
              maxLength={20}
            />
            <p className="text-xs text-muted-foreground">
              {username.length}/20 characters
            </p>
          </div>

          <div className="pt-4">
            <Button
              onClick={handleJoinRoom}
              disabled={!isFormValid || isJoining}
              className="w-full"
              size="lg"
            >
              {isJoining ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Joining Room...
                </>
              ) : (
                <>
                  <LogInIcon className="w-4 h-4 mr-2" />
                  Join Room
                </>
              )}
            </Button>
            <div className="flex justify-center mt-2">
              <Button variant="link" onClick={onSwitchView} type="button">
                Switch to Create Room
              </Button>
            </div>
          </div>

          <div className="bg-muted/70 rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">
              Ask your friend for the invite code to join their game
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default JoinRoomView;
