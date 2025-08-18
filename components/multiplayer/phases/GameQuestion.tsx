"use client";

import { useState, useEffect, useRef } from "react";
import { ArrowLeftRightIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FlagDisplay from "@/components/FlagDisplay";
import AnswerOptions from "@/components/AnswerOptions";
import Header from "@/components/Header";
import LevelBadge from "@/components/LevelBadge";
import Timer from "@/components/Timer";
import { Progress } from "@/components/ui/progress";
import Leaderboard from "@/components/multiplayer/Leaderboard";
import { useSocket } from "@/lib/context/SocketContext";
import { useGameState } from "@/lib/hooks/useGameState";
import { Room } from "@/lib/types/socket";

interface GameQuestionProps {
  room: Room;
}

export default function GameQuestion({ room }: GameQuestionProps) {
  const { currentUser, submitAnswer } = useSocket();
  const { currentQuestion, currentPhase, isGameActive, gameState } = useGameState();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [progressPercent, setProgressPercent] = useState(100);
  const [progressDurationMs, setProgressDurationMs] = useState<number | undefined>(undefined);
  const rafId1 = useRef<number | null>(null);
  const rafId2 = useRef<number | null>(null);

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

  useEffect(() => {
    const timePerQuestion = room.settings.timePerQuestion || 30;

    // Cleanup any pending animation frames
    if (rafId1.current) cancelAnimationFrame(rafId1.current);
    if (rafId2.current) cancelAnimationFrame(rafId2.current);
    rafId1.current = null;
    rafId2.current = null;

    if (currentPhase !== "question") {
      setProgressDurationMs(200);
      setProgressPercent(0);
      return;
    }

    // Reset to full instantly, then animate down to 0 over the question duration
    setProgressDurationMs(0);
    setProgressPercent(100);
    rafId1.current = requestAnimationFrame(() => {
      rafId2.current = requestAnimationFrame(() => {
        setProgressDurationMs(timePerQuestion * 1000);
        setProgressPercent(0);
      });
    });

    return () => {
      if (rafId1.current) cancelAnimationFrame(rafId1.current);
      if (rafId2.current) cancelAnimationFrame(rafId2.current);
      rafId1.current = null;
      rafId2.current = null;
    };
  }, [currentPhase, currentQuestion?.questionNumber, room.settings.timePerQuestion]);

  const handleAnswerSelect = async (answer: string) => {
    if (hasAnswered || !currentQuestion) return;

    setSelectedAnswer(answer);
    setHasAnswered(true);

    try {
      await submitAnswer(answer);
      //toast.success("Answer submitted!");
    } catch (error) {
      toast.error("Failed to submit answer");
      setHasAnswered(false);
      setSelectedAnswer(null);
    }
  };

  const getButtonClass = (country: any) => {
    if (!hasAnswered || !selectedAnswer) {
      return "border-border hover:border-primary/50 hover:bg-primary/5 dark:border-primary/50 dark:bg-primary/5 dark:hover:border-primary/70 transition-all duration-200";
    }

    const correctAnswer = currentQuestion?.country?.code;

    if (country.code === correctAnswer) {
      return "bg-green-100 border-green-500 text-green-700 dark:bg-green-700/40 dark:border-green-500 dark:text-white dark:shadow-lg hover:text-green-700 focus:text-green-700 dark:hover:text-white dark:focus:text-white disabled:bg-green-100 disabled:text-green-700 disabled:dark:bg-green-700/40 disabled:dark:text-white !opacity-100 !grayscale-0 shadow";
    }

    if (country.code === selectedAnswer && country.code !== correctAnswer) {
      return "bg-red-50 border-red-400 text-red-700 dark:bg-red-700/40 dark:border-red-500 dark:text-white dark:shadow-lg hover:text-red-700 focus:text-red-700 dark:hover:text-red-700 dark:focus:text-red-700 disabled:bg-red-50 disabled:text-red-700 disabled:dark:bg-red-700/40 disabled:dark:text-white !opacity-100 !grayscale-0 shadow";
    }

    return "!opacity-40 border-border/50 !grayscale-0";
  };

  if (!currentQuestion) {
    return (
      <div className="min-h-screen h-screen sm:min-h-screen sm:h-auto bg-background overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="text-center">
            <p className="text-muted-foreground">Loading question...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen h-screen sm:min-h-screen sm:h-auto bg-background overflow-y-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
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
                <span className="text-sm font-medium text-foreground">
                  LEVEL
                </span>
                <LevelBadge difficulty={room.settings.difficulty} />
              </div>
            }
            showDifficultyDialog={showDifficultyDialog}
            setShowDifficultyDialog={setShowDifficultyDialog}
          />
        </div>

        <div className="flex gap-6 items-start">
          <div className="flex-1">
            <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 py-4 sm:py-8 px-4 sm:px-6 relative">
              <CardContent className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-3 sm:mb-5">
                  <div className="text-sm font-medium text-foreground">
                    Question {currentQuestion.questionNumber} of {gameState?.totalQuestions || 0}
                  </div>
                  <div className="text-sm text-muted-foreground flex items-center gap-3">
                    <span className="font-medium text-foreground">
                      Score: {currentUser?.score ?? 0}
                    </span>
                    <span className="text-border">•</span>
                    <Timer
                      timePerQuestion={room.settings.timePerQuestion || 30}
                      questionNumber={currentQuestion?.questionNumber || 0}
                      currentPhase={currentPhase}
                    />
                  </div>
                </div>
                <Progress value={progressPercent} durationMs={progressDurationMs} className="mb-4" />

                <div className="mb-4 sm:mb-8">
                  <FlagDisplay
                    flag={`/images/flags/${currentQuestion.country.code}.svg`}
                    countryName={currentQuestion.country.name}
                  />
                </div>

                <AnswerOptions
                  options={currentQuestion.options}
                  showResult={hasAnswered || currentPhase === "results"}
                  handleAnswer={(country) => handleAnswerSelect(country.code)}
                  selectedAnswer={selectedAnswer}
                  getButtonClass={getButtonClass}
                  disabled={hasAnswered || currentPhase === "results"}
                />
              </CardContent>

              <div
                className={`absolute inset-0 bg-black/40 rounded-[2rem] flex items-center justify-center transition-opacity duration-300 ease-in-out ${
                  currentPhase === "results"
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="text-center">
                  <p className="text-white/90 mb-1 text-sm">Next question in</p>
                  <div className="text-4xl font-bold text-white">
                    {countdown}
                  </div>
                </div>
              </div>
            </Card>
          </div>
          <Leaderboard
            members={room.members}
            currentUser={currentUser}
            hostId={room.host}
            isGameActive={isGameActive}
            variant="inline"
          />
        </div>
      </div>
    </div>
  );
}
