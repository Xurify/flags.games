"use client";

import { useMemo } from "react";
import { HomeIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSocket } from "@/lib/context/SocketContext";
import { useGameState } from "@/lib/hooks/useGameState";
import { Room } from "@/lib/types/socket";
import { cn } from "@/lib/utils/strings";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface GameFinishedProps {
  room: Room;
}

export default function GameFinished({ room }: GameFinishedProps) {
  const router = useRouter();
  const { leaveRoom, startGame, currentUser } = useSocket();
  const { gameState, leaderboard } = useGameState();

  const isHost = currentUser?.id === room.host;

  const myPlacement = useMemo(() => {
    if (!currentUser) return null;
    const index = leaderboard.findIndex((p) => p.userId === currentUser.id);
    if (index === -1) return null;
    return {
      rank: index + 1,
      me: leaderboard[index],
    };
  }, [leaderboard, currentUser]);

  const handleLeaveGame = async () => {
    await leaveRoom();
    router.push("/lobby");
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
                  onClick={handleLeaveGame}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <HomeIcon className="w-3 h-3" />
                </Button>
                <span className="text-sm font-medium text-foreground">
                  MULTIPLAYER
                </span>
                <Badge variant="default" className="flex items-center gap-1">
                  <UsersIcon className="w-3 h-3" />
                  {room.members.length}
                </Badge>
              </div>
            }
          />
        </div>

        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 py-4 sm:py-8 px-4 sm:px-6">
          <CardContent className="p-3 sm:p-4">
            <div className="space-y-5">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-semibold">Final results</h2>
                <p className="text-sm text-muted-foreground">
                  {leaderboard[0]
                    ? currentUser?.id &&
                      leaderboard[0].userId === currentUser.id
                      ? "You placed #1."
                      : `Winner: ${leaderboard[0].username}`
                    : "Thanks for playing."}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">Your rank </span>
                  <span className="font-semibold">
                    {myPlacement?.rank ? `#${myPlacement.rank}` : "-"}
                  </span>
                </div>
                <span className="text-border hidden sm:inline">•</span>
                <div>
                  <span className="text-muted-foreground">Score </span>
                  <span className="font-semibold">
                    {myPlacement?.me?.score ?? 0} pts
                  </span>
                </div>
                <span className="text-border hidden sm:inline">•</span>
                <div>
                  <span className="text-muted-foreground">Correct </span>
                  <span className="font-semibold">
                    {myPlacement?.me?.correctAnswers ?? 0}/
                    {gameState?.totalQuestions || 0}
                  </span>
                </div>
              </div>

              <div>
                <div className="divide-y divide-border/50 max-h-[45vh] overflow-y-auto sm:max-h-none">
                  {leaderboard.map((player, index) => {
                    const isYou = currentUser?.id === player.userId;
                    return (
                      <div
                        key={player.userId}
                        className={cn(
                          "grid grid-cols-[2ch_1fr_auto] items-center gap-3 px-3 py-2",
                          isYou &&
                            "[&>*:nth-child(2)>span:first-child]:font-semibold"
                        )}
                      >
                        <div className="text-xs tabular-nums text-muted-foreground">
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex items-center gap-1">
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
                        <div className="text-xs tabular-nums text-muted-foreground flex items-center gap-3">
                          <span>
                            {player.correctAnswers}/
                            {gameState?.totalQuestions || 0}
                          </span>
                          <span className="text-border">•</span>
                          <span className="font-semibold text-foreground">
                            {player.score}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                {isHost && (
                  <Button
                    onClick={() => startGame()}
                    className="w-full sm:w-auto"
                  >
                    Play Again
                  </Button>
                )}
                <Button
                  onClick={handleLeaveGame}
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Back to Lobby
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
