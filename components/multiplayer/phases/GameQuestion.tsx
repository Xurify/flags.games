"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ArrowLeftIcon } from "lucide-react";
import { cn } from "@/lib/utils/strings";
import { Badge } from "@/components/ui/badge";
import FlagDisplay from "@/components/FlagDisplay";
import AnswerOptions from "@/components/AnswerOptions";
import Timer from "@/components/Timer";
import Leaderboard from "@/components/multiplayer/Leaderboard";

import { useSocket } from "@/lib/context/SocketContext";
import { useGameState } from "@/lib/hooks/useGameState";
import { Room } from "@/lib/types/socket";
import { audioManager } from "@/lib/utils/audio-manager";
import { AUDIO_URLS, AUDIO_URLS_KEYS } from "@/lib/constants";

interface GameQuestionProps {
  room: Room;
}

export default function GameQuestion({ room }: GameQuestionProps) {
  const { currentUser, submitAnswer, currentRoom } = useSocket();
  const { currentQuestion, currentPhase, isGameActive, gameState } =
    useGameState();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (currentQuestion) {
      setSelectedAnswer(null);
      setHasAnswered(false);
    }
  }, [currentQuestion?.index]);

  useEffect(() => {
    if (currentPhase === "results") {
      setCountdown(3);
      const timer = setInterval(() => {
        setCountdown((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentPhase]);

  useEffect(() => {
    if (
      Number(gameState?.currentQuestion?.index) >=
      Number(gameState?.totalQuestions) - 4
    ) {
      audioManager.preloadAudio(AUDIO_URLS.VICTORY, AUDIO_URLS_KEYS.VICTORY);
    }
  }, [gameState?.currentQuestion?.index, gameState?.totalQuestions]);

  const handleAnswerSelect = async (answer: string) => {
    if (hasAnswered || !currentQuestion) return;

    setSelectedAnswer(answer);
    setHasAnswered(true);

    try {
      await submitAnswer(answer);
    } catch (error) {
      toast.error("Failed to submit answer");
      setHasAnswered(false);
      setSelectedAnswer(null);
    }
  };

  const userScore = currentUser
    ? gameState?.leaderboard.find((user) => user.userId === currentUser.id)
      ?.score ?? 0
    : 0;

  if (!currentQuestion) {
    return (
      <div className="text-center">
        <p className="text-muted-foreground">Loading question...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-stretch lg:items-start mx-auto px-4 lg:px-12 pt-20 lg:pt-28">
      <div className="flex-1 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-foreground pb-4 mb-2">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center justify-center w-10 h-10 border-2 border-foreground shadow-retro hover:bg-destructive hover:text-white transition-all active:translate-y-0.5 active:shadow-none bg-background shrink-0"
              title="Leave Match"
            >
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground leading-none mb-1">
                Round {currentQuestion.index} <span className="opacity-40">/ {gameState?.totalQuestions || 0}</span>
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-foreground uppercase leading-tight">
                Identify the Flag
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 bg-card border-2 border-foreground shadow-retro-sm px-4 py-2 self-start sm:self-auto uppercase font-black">
            <div className="flex flex-col items-center min-w-[64px]">
              <span className="text-[9px] text-muted-foreground mb-0.5">Score</span>
              <span className="text-xl sm:text-2xl text-primary tabular-nums leading-none">{userScore}</span>
            </div>
            <div className="w-px h-6 bg-foreground/10" />
            <div className="flex flex-col items-center min-w-[64px]">
              <span className="text-[9px] text-muted-foreground mb-0.5">Rank</span>
              <span className="text-xl sm:text-2xl tabular-nums leading-none">
                {gameState?.leaderboard ? `#${gameState.leaderboard.findIndex(p => p.userId === currentUser?.id) + 1}` : "-"}
              </span>
            </div>
            <div className="w-px h-6 bg-foreground/10" />
            <div className="flex flex-col items-center min-w-[64px]">
              <span className="text-[9px] text-muted-foreground mb-0.5">Time</span>
              <Timer
                timePerQuestion={room.settings.timePerQuestion}
                questionIndex={Number(currentQuestion?.index)}
                currentPhase={currentPhase}
                startTimeMs={currentQuestion.startTime}
              />
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="bg-card border-2 border-foreground shadow-retro p-4 sm:p-8">
            <div className="mb-6">
              <FlagDisplay countryCode={currentQuestion.country.code} />
            </div>

            <AnswerOptions
              options={currentQuestion.options}
              showResult={hasAnswered || currentPhase === "results"}
              handleAnswer={(country) => handleAnswerSelect(country.code)}
              selectedAnswer={selectedAnswer}
              disabled={hasAnswered || currentPhase === "results"}
              correctAnswer={currentQuestion.country.code}
            />
          </div>

          <div
            className={`absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center transition-all duration-300 ease-in-out z-20 ${currentPhase === "results" && countdown > 0
              ? "opacity-100 scale-100"
              : "opacity-0 scale-95 pointer-events-none"
              }`}
          >
            <p className="font-black text-2xl tracking-tighter mb-2 uppercase">Next Question In</p>
            <div className="text-8xl font-black text-foreground tabular-nums tracking-tighter leading-none">{countdown}</div>
            <div className="w-48 h-2.5 bg-muted mt-8 overflow-hidden border-2 border-foreground shadow-retro-sm">
              <div
                className={cn(
                  "h-full bg-primary ease-linear",
                  countdown < 3 && "transition-all duration-1000"
                )}
                style={{ width: `${(countdown / 3) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <Leaderboard
        members={currentRoom?.members ?? room.members}
        leaderboard={gameState?.leaderboard ?? []}
        answers={gameState?.answers ?? []}
        currentUser={currentUser}
        hostId={currentRoom?.host ?? room.host}
        isGameActive={isGameActive}
      />
    </div >
  );
}
