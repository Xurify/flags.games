"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import FlagDisplay from "@/components/FlagDisplay";
import AnswerOptions from "@/components/AnswerOptions";
import Timer from "@/components/Timer";
import Leaderboard from "@/components/multiplayer/Leaderboard";

import { useSocket } from "@/lib/context/SocketContext";
import { useGameState } from "@/lib/hooks/useGameState";
import { Room } from "@/lib/types/socket";
 

interface GameQuestionProps {
  room: Room;
}

export default function GameQuestion({ room }: GameQuestionProps) {
  const { currentUser, submitAnswer } = useSocket();
  const { currentQuestion, currentPhase, isGameActive, gameState } =
    useGameState();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (currentQuestion) {
      setSelectedAnswer(null);
      setHasAnswered(false);
    }
  }, [currentQuestion?.questionNumber]);

  useEffect(() => {
    if (currentPhase === "results") {
      setCountdown(5);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [currentPhase]);

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
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 items-stretch lg:items-start">
      <div className="flex-1">
        <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 py-4 sm:py-8 px-4 sm:px-6 relative">
          <CardContent className="p-3 sm:p-4">
            <div className="flex flex-wrap items-center justify-between gap-y-2 mb-3 sm:mb-5">
              <div className="text-sm font-medium text-foreground">
                Question {currentQuestion.questionNumber} of {gameState?.totalQuestions || 0}
              </div>
              <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="font-medium text-foreground">Score: {userScore}</span>
                <span className="text-border dark:text-white">•</span>
                <Timer
                  timePerQuestion={room.settings.timePerQuestion || 30}
                  questionNumber={currentQuestion?.questionNumber || 0}
                  currentPhase={currentPhase}
                />
              </div>
            </div>

            <div className="mb-4 sm:mb-8">
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
          </CardContent>

          <div
            className={`absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center transition-opacity duration-300 ease-in-out ${
              currentPhase === "results" ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <div className="text-center">
              <p className="text-white/90 mb-1 text-sm">Next question in</p>
              <div className="text-4xl font-bold text-white">{countdown}</div>
            </div>
          </div>
        </Card>
      </div>
      <Leaderboard
        members={room.members}
        leaderboard={gameState?.leaderboard ?? []}
        currentUser={currentUser}
        hostId={room.host}
        isGameActive={isGameActive}
        variant="inline"
      />
    </div>
  );
}
