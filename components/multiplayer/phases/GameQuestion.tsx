"use client";

import { useState, useEffect } from "react";
import { ArrowLeftRightIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import FlagDisplay from "@/components/FlagDisplay";
import AnswerOptions from "@/components/AnswerOptions";
import Header from "@/components/Header";
import LevelBadge from "@/components/LevelBadge";
import Timer from "@/components/Timer";
import Leaderboard from "@/components/multiplayer/Leaderboard";
import { useSocket } from "@/lib/context/SocketContext";
import { useGameState } from "@/lib/hooks/useGameState";
import { Room } from "@/lib/types/socket";

interface GameQuestionProps {
  room: Room;
}

export default function GameQuestion({ room }: GameQuestionProps) {
  const { gameState, currentUser, submitAnswer } = useSocket();
  const { currentQuestion, currentPhase } = useGameState();

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [countdown, setCountdown] = useState(8);

  useEffect(() => {
    if (currentQuestion) {
      setSelectedAnswer(null);
      setHasAnswered(false);
    }
  }, [currentQuestion?.questionNumber]);

  useEffect(() => {
    if (currentPhase === "results") {
      setCountdown(8);
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

    const correctAnswer = currentQuestion?.country?.name;

    if (country.name === correctAnswer) {
      return "bg-green-100 border-green-500 text-green-700 dark:bg-green-700/40 dark:border-green-500 dark:text-white dark:shadow-lg hover:text-green-700 focus:text-green-700 dark:hover:text-white dark:focus:text-white disabled:bg-green-100 disabled:text-green-700 disabled:dark:bg-green-700/40 disabled:dark:text-white !opacity-100 !grayscale-0 shadow";
    }

    if (country.name === selectedAnswer && country.name !== correctAnswer) {
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

        <div className="mb-4">
          <div className="flex justify-center items-center">
            <div className="relative flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm font-medium text-muted-foreground">
                  Question {currentQuestion.questionNumber} of{" "}
                  {gameState?.totalQuestions || 0}
                </span>
              </div>
              <div className="w-px h-4 bg-border"></div>
              <div className="flex items-center gap-2">
                <Timer
                  timePerQuestion={room.settings.timePerQuestion || 30}
                  questionNumber={currentQuestion?.questionNumber || 0}
                  currentPhase={currentPhase}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          <Leaderboard 
            members={room.members}
            currentUser={currentUser}
            hostId={room.host}
            isGameActive={gameState?.isActive || false}
          />
          <div className="flex-1">
            <Card className="shadow-card hover:shadow-card-hover transition-all duration-300 py-4 sm:py-8 px-4 sm:px-6 relative">
              <CardContent className="p-3 sm:p-4">
                <div className="text-center mb-4 sm:mb-8">
                  <h1 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2">
                    Guess the Country
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Test your knowledge and identify countries by their flags
                  </p>
                </div>

                <div className="mb-4 sm:mb-8">
                  <FlagDisplay
                    flag={`/images/flags/${currentQuestion.country.code}.svg`}
                    countryName={currentQuestion.country.name}
                  />
                </div>

                <AnswerOptions
                  options={currentQuestion.options}
                  showResult={hasAnswered || currentPhase === "results"}
                  handleAnswer={(country) => handleAnswerSelect(country.name)}
                  selectedAnswer={selectedAnswer}
                  getButtonClass={getButtonClass}
                  disabled={hasAnswered || currentPhase === "results"}
                />
              </CardContent>

              <div
                className={`absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center transition-all duration-500 ease-in-out ${
                  currentPhase === "results"
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="text-center">
                  <p className="text-white mb-2">Next question in:</p>
                  <div className="text-4xl font-bold text-white">{countdown}</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
