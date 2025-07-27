"use client";

import { useState } from "react";
import { PauseIcon, PlayIcon, ArrowLeftRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSocket } from "@/lib/context/SocketContext";
import { Room } from "@/lib/types/socket";
import Header from "@/components/Header";
import LevelBadge from "@/components/LevelBadge";

interface GamePausedProps {
  room: Room;
}

export default function GamePaused({ room }: GamePausedProps) {
  const { currentUser, resumeGame } = useSocket();
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
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                    <PauseIcon className="w-8 h-8 text-yellow-600" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold">Game Paused</h2>
                <p className="text-muted-foreground">
                  The host has paused the game.
                </p>
                {currentUser?.id === room.host && (
                  <div className="mt-6">
                    <Button onClick={resumeGame} className="flex items-center gap-2">
                      <PlayIcon className="w-4 h-4" />
                      Resume Game
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 