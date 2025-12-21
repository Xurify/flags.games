"use client";

import { useMemo, useEffect, Suspense, lazy } from "react";
import { useSocket } from "@/lib/context/SocketContext";
import { useSettings } from "@/lib/context/SettingsContext";
import { Room } from "@/lib/types/socket";
import { cn } from "@/lib/utils/strings";
import { audioManager } from "@/lib/utils/audio-manager";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CrownIcon, ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const Confetti = lazy(() => import("react-confetti"));

interface GameFinishedProps {
  room: Room;
}

export default function GameFinished({ room }: GameFinishedProps) {
  const { restartGame, stopGame, currentUser, gameState, leaderboard, currentRoom } = useSocket();
  const { settings } = useSettings();

  useEffect(() => {
    if (settings.soundEffectsEnabled && gameState?.phase === "finished") {
      audioManager.playVictorySound();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState?.phase]);

  const isHost = currentUser?.id === room.host;

  const currentUserPlacement = useMemo(() => {
    if (!currentUser) return null;
    const index = leaderboard.findIndex((player) => player.userId === currentUser.id);
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
      window.location.href = "/";
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto pt-6 pb-32 px-4 sm:px-6">
      <div className="flex items-center gap-3 border-b-2 border-foreground pb-4 mb-4">
        <Link
          href="/"
          className="flex items-center justify-center w-9 h-9 border-2 border-foreground shadow-retro hover:bg-destructive hover:text-white transition-all active:translate-y-0.5 active:shadow-none"
          title="Return home"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </Link>
        <div className="flex flex-col">
          <h2 className="text-xl sm:text-2xl font-black tracking-tighter text-foreground uppercase leading-none">Game Over</h2>
          <p className="font-mono text-[9px] text-muted-foreground uppercase tracking-[0.2em] mt-1">Session Terminated</p>
        </div>
      </div>

      {gameState?.phase === "finished" && (
        <Suspense fallback={null}>
          <Confetti
            width={window.innerWidth - 100}
            height={window.innerHeight}
            numberOfPieces={350}
            recycle={false}
            className="w-full h-full"
          />
        </Suspense>
      )}

      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground leading-[0.9] uppercase">
          Final
          <br />
          <span className="text-destructive whitespace-nowrap">Results</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "RANK",
            value: currentUserPlacement?.rank ? `#${currentUserPlacement.rank}` : "-",
            highlight: true,
          },
          {
            label: "SCORE",
            value: (currentUserPlacement?.me?.score ?? 0).toString(),
          },
          {
            label: "CORRECT",
            value: `${currentUserPlacement?.me?.correctAnswers ?? 0}/${gameState?.totalQuestions || 0}`,
          },
          {
            label: "ACCURACY",
            value: `${(() => {
              const totalQ = gameState?.totalQuestions || 0;
              const correct = currentUserPlacement?.me?.correctAnswers ?? 0;
              if (!totalQ) return 0;
              return Math.round((correct / totalQ) * 100);
            })()}%`,
          },
        ].map((stat) => (
          <div
            key={`game-finished-stats-${stat.label}`}
            className={cn(
              "p-6 border-2 border-foreground shadow-retro flex flex-col items-center justify-center text-center",
              stat.highlight ? "bg-primary text-primary-foreground" : "bg-card text-foreground"
            )}
          >
            <span className="font-mono text-[10px] uppercase font-bold opacity-70 mb-1">{stat.label}</span>
            <span className="text-3xl font-black tracking-tighter leading-none">{stat.value}</span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-black tracking-tight uppercase border-b-2 border-foreground pb-2">Final Standings</h3>
        <div className="border-2 border-foreground shadow-retro overflow-hidden">
          <Table>
            <TableHeader className="bg-muted dark:bg-muted/20">
              <TableRow className="hover:bg-transparent border-b-2 border-foreground">
                <TableHead className="w-16 font-black text-foreground uppercase tracking-wider text-center">Pos</TableHead>
                <TableHead className="font-black text-foreground uppercase tracking-wider">Player</TableHead>
                <TableHead className="w-32 font-black text-foreground uppercase tracking-wider text-center">Score</TableHead>
                <TableHead className="w-32 font-black text-foreground uppercase tracking-wider text-right">Correct</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leaderboard.map((player, index) => {
                const isYou = currentUser?.id === player.userId;
                return (
                  <TableRow
                    key={player.userId}
                    className={cn("group border-b-2 border-foreground last:border-0", isYou ? "bg-primary/5" : "bg-card")}
                  >
                    <TableCell className="text-2xl font-black tracking-tighter text-foreground/20 group-hover:text-foreground/40 text-center transition-colors italic p-2">
                      {index + 1}
                    </TableCell>
                    <TableCell className="p-2">
                      <div className="flex items-center gap-3">
                        <span className={cn("text-lg", isYou ? "font-black text-primary" : "font-bold text-foreground")}>
                          {player.username}
                        </span>
                        {index === 0 && <CrownIcon className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                        {isYou && (
                          <Badge
                            variant="outline"
                            size="sm"
                            className="font-black text-[9px] h-4 bg-primary text-white leading-none"
                          >
                            YOU
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-black tabular-nums text-lg p-2">{player.score}</TableCell>
                    <TableCell className="text-right font-bold text-muted-foreground tabular-nums p-2 pr-4">
                      {player.correctAnswers} <span className="text-xs">/ {gameState?.totalQuestions}</span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        {isHost && (
          <Button
            onClick={() => restartGame()}
            className="w-full sm:w-auto h-16 px-12 text-xl font-black tracking-tighter bg-destructive hover:bg-destructive/90 text-white shadow-retro border-2 border-foreground active:translate-x-1 active:translate-y-1 active:shadow-none"
            disabled={Number(currentRoom?.members?.length) < 1}
          >
            PLAY AGAIN
          </Button>
        )}
        <Button
          onClick={handleBackToLobby}
          variant="outline"
          className="w-full sm:w-auto h-16 px-12 text-xl font-black tracking-tighter shadow-retro border-2 border-foreground active:translate-x-1 active:translate-y-1 active:shadow-none"
        >
          {isHost ? "RETURN TO LOBBY" : "LEAVE MATCH"}
        </Button>
      </div>
    </div>
  );
}
