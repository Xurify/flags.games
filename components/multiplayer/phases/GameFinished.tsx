"use client";

import { useState } from "react";
import { TrophyIcon, ArrowLeftRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useSocket } from "@/lib/context/SocketContext";
import { useGameState } from "@/lib/hooks/useGameState";
import { Room } from "@/lib/types/socket";
import { cn } from "@/lib/utils/strings";
import Header from "@/components/Header";
import LevelBadge from "@/components/LevelBadge";

interface GameFinishedProps {
  room: Room;
}

export default function GameFinished({ room }: GameFinishedProps) {
  const { gameState, currentUser, leaveRoom } = useSocket();
  const { leaderboard } = useGameState();
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);

  const handleLeaveGame = async () => {
    await leaveRoom();
  };

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
            <div className="text-center mb-4 sm:mb-8">
              <h2 className="text-2xl font-bold mb-2">Game Finished!</h2>
              <p className="text-muted-foreground">Thanks for playing!</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <TrophyIcon className="w-5 h-5" />
                Final Results
              </h3>
              <div className="space-y-2">
                {leaderboard.map((player, index) => (
                  <div
                    key={player.userId}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border",
                      index === 0
                        ? "bg-yellow-50 border-yellow-200"
                        : "bg-card border-border"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={index === 0 ? "default" : "outline"}
                        className="w-8 h-8 p-0 flex items-center justify-center"
                      >
                        {index === 0
                          ? "🥇"
                          : index === 1
                          ? "🥈"
                          : index === 2
                          ? "🥉"
                          : index + 1}
                      </Badge>
                      <span className="font-medium">{player.username}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        {player.correctAnswers}/{gameState?.totalQuestions || 0} correct
                      </span>
                      <span className="font-bold text-lg">{player.score} pts</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center">
              <Button onClick={handleLeaveGame} variant="outline">
                Back to Lobby
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 