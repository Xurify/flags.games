"use client";

import { useMemo } from "react";
import { useSocket } from "@/lib/context/SocketContext";
import { useGameState } from "@/lib/hooks/useGameState";
import { Room } from "@/lib/types/socket";
import { cn } from "@/lib/utils/strings";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Crown } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface GameFinishedProps {
  room: Room;
}

export default function GameFinished({ room }: GameFinishedProps) {
  const { restartGame, stopGame, leaveRoom, currentUser } = useSocket();
  const { gameState, leaderboard } = useGameState();

  const isHost = currentUser?.id === room.host;

  const myPlacement = useMemo(() => {
    if (!currentUser) return null;
    const index = leaderboard.findIndex(
      (player) => player.userId === currentUser.id
    );
    if (index === -1) return null;
    return {
      rank: index + 1,
      me: leaderboard[index],
    };
  }, [leaderboard, currentUser]);

  const handleBackToLobby = async () => {
    if (isHost) {
      await stopGame();
    } else {
      window.location.href = "/lobby";
    }
  };

  return (
    <Card className="py-4 sm:py-8 px-4 sm:px-6 bg-transparent border-none">
      <CardContent className="p-3 sm:p-4">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Crown className="w-6 h-6  fill-yellow-500" aria-hidden="true" />
              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                Final results
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-center">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
                {myPlacement?.rank ? `#${myPlacement.rank}` : "-"}
              </div>
              <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">
                Final
                <br />
                Placement
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
                {myPlacement?.me?.score ?? 0}
              </div>
              <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">
                Your
                <br />
                Score (pts)
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
                {myPlacement?.me?.correctAnswers ?? 0}/
                {gameState?.totalQuestions || 0}
              </div>
              <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">
                Correct
                <br />
                Answers
              </div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
                {(() => {
                  const totalQ = gameState?.totalQuestions || 0;
                  const correct = myPlacement?.me?.correctAnswers ?? 0;
                  if (!totalQ) return 0;
                  return Math.round((correct / totalQ) * 100);
                })()}
                %
              </div>
              <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">
                Overall
                <br />
                Accuracy Rate
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-semibold mb-2">Leaderboard</h3>
            <div className="[&_[data-slot='table-container']]:max-h-[480px]">
              <Table>
                <TableHeader className="sticky top-0 bg-background z-10">
                  <TableRow>
                    <TableHead className="w-12 text-right tabular-nums">
                      #
                    </TableHead>
                    <TableHead className="min-w-[240px] text-left">
                      Player
                    </TableHead>
                    <TableHead className="w-32 text-center">Correct</TableHead>
                    <TableHead className="w-24 text-right">Score</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderboard.map((player, index) => {
                    const isYou = currentUser?.id === player.userId;
                    return (
                      <TableRow
                        key={player.userId}
                        className={cn(
                          isYou ? "bg-yellow-400/30 hover:bg-yellow-400/40" : ""
                        )}
                      >
                        <TableCell className="text-right tabular-nums text-muted-foreground">
                          {index + 1}
                        </TableCell>
                        <TableCell className="min-w-[240px] whitespace-normal align-middle">
                          <div className="flex items-center gap-1">
                            <span
                              className={cn(
                                "truncate",
                                isYou ? "font-semibold" : "font-medium"
                              )}
                            >
                              {player.username}
                            </span>
                            {isYou && (
                              <span className="text-[11px] font-semibold text-primary">
                                (You)
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-center tabular-nums align-middle">
                          {player.correctAnswers}/
                          {gameState?.totalQuestions || 0}
                        </TableCell>
                        <TableCell className="text-right tabular-nums align-middle">
                          {player.score}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            {isHost && (
              <Button
                onClick={() => restartGame()}
                className="w-full sm:w-auto"
              >
                Play Again
              </Button>
            )}
            <Button
              onClick={handleBackToLobby}
              variant="outline"
              className="w-full sm:w-auto"
            >
              {isHost ? "Back to Lobby" : "Leave Room"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
