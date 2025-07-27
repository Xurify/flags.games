"use client";

import { useState } from "react";
import { UsersIcon, PlayIcon, ArrowLeftRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSocket } from "@/lib/context/SocketContext";
import { Room } from "@/lib/types/socket";
import Header from "@/components/Header";
import LevelBadge from "@/components/LevelBadge";

interface GameStartingProps {
  room: Room;
}

export default function GameStarting({ room }: GameStartingProps) {
  const { resumeGame } = useSocket();
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);

  return (
    <div className="min-h-screen h-screen sm:min-h-screen sm:h-auto bg-background overflow-y-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
        <div className="mb-4">
          <Header
            leftContent={
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setShowDifficultyDialog(true)}
                  className="text-muted-foreground hover:text-foreground"
                  title="Change difficulty"
                >
                  <ArrowLeftRightIcon className="w-3 h-3" />
                </Button>
                <span className="text-sm font-medium text-foreground">LEVEL</span>
                <LevelBadge difficulty={room.settings.difficulty} />
              </div>
            }
            showDifficultyDialog={showDifficultyDialog}
            setShowDifficultyDialog={setShowDifficultyDialog}
          />
        </div>

        <Card className="mb-3 sm:mb-6 shadow-card hover:shadow-card-hover transition-all duration-300 py-4 sm:py-8 px-4 sm:px-6">
          <CardContent className="p-3 sm:p-4">
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <div className="flex justify-center">
                  <PlayIcon className="w-16 h-16 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Game Starting...</h2>
                <p className="text-muted-foreground">
                  Get ready! The game will begin in a few seconds.
                </p>
                <div className="mt-4 flex items-center justify-center gap-2">
                  <UsersIcon className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {room.members.length} players ready
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 