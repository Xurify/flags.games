"use client";

import React, { useState } from "react";
import { PlusIcon, HomeIcon, UsersIcon } from "lucide-react";

import { RoomSettings } from "@/lib/types/multiplayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "@/components/Header";
import CreateRoomView from "./CreateRoomView";
import JoinRoomView from "./JoinRoomView";

interface MultiplayerLobbyProps {
  onCreateRoom: (roomName: string, settings: RoomSettings) => void;
  onJoinRoom: (roomCode: string, username: string) => void;
  isCreating?: boolean;
  isJoining?: boolean;
  joinError?: string;
}

type View = "lobby" | "create" | "join";

const MultiplayerLobby: React.FC<MultiplayerLobbyProps> = ({
  onCreateRoom,
  onJoinRoom,
  isCreating = false,
  isJoining = false,
  joinError,
}) => {
  const [currentView, setCurrentView] = useState<View>("lobby");
  const router = require("next/navigation").useRouter();

  return (
    <div className="min-h-screen h-screen sm:min-h-screen sm:h-auto bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-8">
          <Header
            leftContent={
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => router.push("/")}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HomeIcon className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium text-foreground">
                  MULTIPLAYER
                </span>
              </div>
            }
          />
        </div>

        {currentView === "create" ? (
          <CreateRoomView onCreateRoom={onCreateRoom} isCreating={isCreating} />
        ) : currentView === "join" ? (
          <JoinRoomView
            onJoinRoom={onJoinRoom}
            isJoining={isJoining}
            error={joinError}
          />
        ) : (
          <Card className="mb-3 sm:mb-6 shadow-card hover:shadow-card-hover transition-all duration-300">
            <CardContent className="p-3 sm:p-4">
              <div className="text-center mb-4 sm:mb-8">
                <h1 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">
                  flags.games Multiplayer
                </h1>
                <p className="text-muted-foreground text-sm">
                  Challenge your friends in real-time flag guessing competitions
                </p>
              </div>

              <div className="grid gap-3 sm:gap-4">
                <Button
                  onClick={() => setCurrentView("create")}
                  className="w-full"
                  size="lg"
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Create Room
                </Button>

                <Button
                  onClick={() => setCurrentView("join")}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <UsersIcon className="w-4 h-4 mr-2" />
                  Join Room
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MultiplayerLobby;
