"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { RotateCcwIcon, HelpCircleIcon, ArrowLeftRightIcon } from "lucide-react";

import {
  CORRECT_POINT_COST,
  MAX_HEARTS,
  AUDIO_URLS,
  AUDIO_URLS_KEYS,
  Difficulty,
  DEFAULT_DIFFICULTY,
} from "@/lib/constants";
import { Country } from "@/lib/data/countries";
import { useGameSettings } from "@/lib/hooks/useGameSettings";
import { generateQuestion, getDifficultySettings } from "@/lib/utils/gameLogic";
import { audioManager, playErrorSound, playSuccessSound } from "@/lib/utils/audioUtils";
import { prefetchAllFlagsForDifficulty } from "@/lib/utils/imageUtils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import Header from "./Header";
import GameEndScreen from "./GameEndScreen";
import LevelBadge from "./LevelBadge";
import QuestionProgress from "./QuestionProgress";
import FlagDisplay from "./FlagDisplay";
import AnswerOptions from "./AnswerOptions";
import HowToPlayDialog from "./HowToPlayDialog";
import RestartDialog from "./RestartDialog";
import DifficultySelector from "./DifficultySelector";

import type { InitialGameData } from "./FlagGameServer";

const Confetti = React.lazy(() => import("react-confetti"));

interface FlagGameClientProps {
  initialGameData: InitialGameData;
}

export interface GameState {
  currentQuestion: number;
  score: number;
  totalQuestions: number;
  currentCountry: Country;
  options: Country[];
  selectedAnswer: string | null;
  showResult: boolean;
  gameCompleted: boolean;
  usedCountries: Set<string>;
  difficulty: Difficulty;
  gameStarted: boolean;
  hearts: number;
}

const FlagGameClient: React.FC<FlagGameClientProps> = ({ initialGameData }) => {
  const { settings } = useGameSettings();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 1,
    score: 0,
    totalQuestions: initialGameData.totalQuestions,
    currentCountry: initialGameData.currentCountry,
    options: initialGameData.options,
    selectedAnswer: null,
    showResult: false,
    gameCompleted: false,
    usedCountries: new Set([initialGameData.currentCountry.code]),
    difficulty: initialGameData.difficulty,
    gameStarted: true,
    hearts: MAX_HEARTS,
  });

  const [heartsModeEnabled, setHeartsModeEnabled] = useState(false);
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [showHowToPlayDialog, setShowHowToPlayDialog] = useState(false);
  const [showScorePopup, setShowScorePopup] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    prefetchAllFlagsForDifficulty(gameState.difficulty);
  }, [gameState.difficulty]);

  useEffect(() => {
    if (gameState.currentQuestion >= gameState.totalQuestions - 2) {
      audioManager.preloadAudio(AUDIO_URLS.VICTORY, AUDIO_URLS_KEYS.VICTORY);
    }
  }, [gameState.currentQuestion, gameState.totalQuestions]);

  const clearGameTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const setGameTimeout = (callback: () => void, delay: number) => {
    clearGameTimeout();
    timeoutRef.current = setTimeout(callback, delay);
  };

  const playSound = (isCorrect: boolean) => {
    if (!settings.soundEffectsEnabled) return;

    if (isCorrect) {
      playSuccessSound();
    } else {
      playErrorSound();
    }
  };

  const generateQuestionHandler = (difficulty?: Difficulty) => {
    const difficultyToUse = difficulty || gameState.difficulty;
    const questionData = generateQuestion(
      difficultyToUse,
      gameState.usedCountries
    );

    if (!questionData) {
      setGameState((prev) => ({
        ...prev,
        gameCompleted: true,
      }));
      return;
    }

    setGameState((prev) => ({
      ...prev,
      currentCountry: questionData.currentCountry,
      options: questionData.options,
      selectedAnswer: null,
      showResult: false,
      usedCountries: new Set([
        ...prev.usedCountries,
        questionData.currentCountry.code,
      ]),
    }));
  };

  const handleAnswer = (selectedCountry: Country) => {
    const isCorrect = selectedCountry.code === gameState.currentCountry.code;

    playSound(isCorrect);

    setGameState((prev) => {
      const newHearts =
        heartsModeEnabled && !isCorrect ? prev.hearts - 1 : prev.hearts;
      const gameOver = heartsModeEnabled && newHearts <= 0;

      return {
        ...prev,
        selectedAnswer: selectedCountry.code,
        showResult: true,
        score: isCorrect ? prev.score + CORRECT_POINT_COST : prev.score,
        hearts: newHearts,
        gameCompleted: gameOver || prev.gameCompleted,
      };
    });

    if (isCorrect) {
      setShowScorePopup(true);
      setTimeout(() => setShowScorePopup(false), 1500);
    }

    const delay = settings.autoAdvanceEnabled ? 2000 : 0;

    if (settings.autoAdvanceEnabled) {
      setGameTimeout(() => {
        const updatedHearts =
          heartsModeEnabled && !isCorrect
            ? gameState.hearts - 1
            : gameState.hearts;
        if (heartsModeEnabled && updatedHearts <= 0) {
          setGameState((prev) => ({
            ...prev,
            gameCompleted: true,
          }));
          return;
        }

        if (gameState.currentQuestion < gameState.totalQuestions) {
          setGameState((prev) => ({
            ...prev,
            currentQuestion: prev.currentQuestion + 1,
          }));
          generateQuestionHandler();
        } else {
          setGameState((prev) => ({
            ...prev,
            gameCompleted: true,
          }));
        }
      }, delay);
    }
  };

  const nextQuestion = () => {
    if (gameState.currentQuestion < gameState.totalQuestions) {
      setGameState((prev) => ({
        ...prev,
        currentQuestion: prev.currentQuestion + 1,
      }));
      generateQuestionHandler();
    } else {
      setGameState((prev) => ({
        ...prev,
        gameCompleted: true,
      }));
    }
  };

  const startGame = () => {
    const totalQuestions = getDifficultySettings(gameState.difficulty).count;

    clearGameTimeout();

    setGameState((prev) => ({
      ...prev,
      currentQuestion: 1,
      score: 0,
      totalQuestions,
      selectedAnswer: null,
      showResult: false,
      gameCompleted: false,
      usedCountries: new Set(),
      gameStarted: true,
      hearts: MAX_HEARTS,
    }));

    generateQuestionHandler();
  };

  const restartGame = () => {
    clearGameTimeout();

    setGameState((prev) => ({
      ...prev,
      currentQuestion: 1,
      score: 0,
      totalQuestions: getDifficultySettings(prev.difficulty).count,
      selectedAnswer: null,
      showResult: false,
      gameCompleted: false,
      usedCountries: new Set(),
      hearts: MAX_HEARTS,
    }));

    generateQuestionHandler();
    setShowRestartDialog(false);
  };

  const handleChangeDifficulty = (newDifficulty: Difficulty) => {
    const newTotalQuestions = getDifficultySettings(newDifficulty).count;

    clearGameTimeout();

    setGameState((prev) => ({
      ...prev,
      difficulty: newDifficulty,
      totalQuestions: newTotalQuestions,
      currentQuestion: 1,
      score: 0,
      selectedAnswer: null,
      showResult: false,
      gameCompleted: false,
      usedCountries: new Set(),
      hearts: MAX_HEARTS,
    }));

    generateQuestionHandler(newDifficulty);
    setShowDifficultyDialog(false);

    const params = new URLSearchParams(searchParams.toString());
    params.set("difficulty", newDifficulty);
    if (newDifficulty === DEFAULT_DIFFICULTY) {
      router.replace("/");
    } else {
      router.replace(`?${params.toString()}`);
    }
  };

  const handleToggleHeartsMode = (value: boolean) => {
    if (gameState.currentQuestion === 1) {
      audioManager.playButtonClickSound();
      setHeartsModeEnabled(value);
    }
  };

  const getScoreMessage = () => {
    const percentage =
      (gameState.score / (gameState.totalQuestions * CORRECT_POINT_COST)) * 100;
    if (percentage >= 90) return "Excellent! You're a geography expert! 🌟";
    if (percentage >= 75) return "Great job! You know your flags well! 🎉";
    if (percentage >= 60) return "Good work! Keep practicing! 👍";
    if (percentage >= 40) return "Not bad! There's room for improvement! 💪";
    return "Keep learning! Practice makes perfect! 📚";
  };

  const getButtonClass = (country: Country) => {
    if (!gameState.showResult || !gameState.selectedAnswer) {
      return "border-border hover:border-primary/50 hover:bg-primary/5 dark:border-primary/50 dark:bg-primary/5 dark:hover:border-primary/70 transition-all duration-200";
    }

    if (country.code === gameState.currentCountry.code) {
      return "bg-green-100 border-green-500 text-green-700 dark:bg-green-700/40 dark:border-green-500 dark:text-white dark:shadow-lg hover:text-green-700 focus:text-green-700 dark:hover:text-white dark:focus:text-white disabled:bg-green-100 disabled:text-green-700 disabled:dark:bg-green-700/40 disabled:dark:text-white !opacity-100 !grayscale-0 shadow";
    }

    if (
      country.code === gameState.selectedAnswer &&
      country.code !== gameState.currentCountry.code
    ) {
      return "bg-red-50 border-red-400 text-red-700 dark:bg-red-700/40 dark:border-red-500 dark:text-white dark:shadow-lg hover:text-red-700 focus:text-red-700 dark:hover:text-white dark:focus:text-white disabled:bg-red-50 disabled:text-red-700 disabled:dark:bg-red-700/40 disabled:dark:text-white !opacity-100 !grayscale-0 shadow";
    }

    return "!opacity-40 border-border/50 !grayscale-0";
  };

  useEffect(() => {
    if (gameState.gameCompleted && settings.soundEffectsEnabled) {
      const percentage =
        (gameState.score / (gameState.totalQuestions * CORRECT_POINT_COST)) *
        100;
      if (percentage >= 60) {
        audioManager.playVictorySound();
      }
    }
  }, [gameState.gameCompleted, settings.soundEffectsEnabled]);

  return (
    <div className="min-h-screen h-screen sm:min-h-screen sm:h-auto bg-background overflow-y-auto">
      {gameState.gameCompleted && (
        <React.Suspense fallback={null}>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={350}
            recycle={false}
          />
        </React.Suspense>
      )}
      <DifficultySelector
        open={showDifficultyDialog}
        onOpenChange={setShowDifficultyDialog}
        onChangeDifficulty={handleChangeDifficulty}
        currentDifficulty={gameState.difficulty}
        onToggleHeartsMode={handleToggleHeartsMode}
        heartsModeEnabled={heartsModeEnabled}
        gameState={gameState}
      />

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
                <LevelBadge difficulty={gameState.difficulty} />
              </div>
            }
            showDifficultyDialog={showDifficultyDialog}
            setShowDifficultyDialog={setShowDifficultyDialog}
          />
        </div>

        <div className="mb-4">
          <QuestionProgress
            currentQuestion={gameState.currentQuestion}
            totalQuestions={gameState.totalQuestions}
            score={gameState.score}
            showScorePopup={showScorePopup}
            CORRECT_POINT_COST={CORRECT_POINT_COST}
            hearts={gameState.hearts}
            maxHearts={MAX_HEARTS}
            heartsModeEnabled={heartsModeEnabled}
          />
        </div>

        <Card className="mb-3 sm:mb-6 shadow-card hover:shadow-card-hover transition-all duration-300 py-4 sm:py-8 px-4 sm:px-6">
          <CardContent className="p-3 sm:p-4">
            {gameState.gameCompleted ? (
              <GameEndScreen
                score={gameState.score}
                totalPossible={gameState.totalQuestions * CORRECT_POINT_COST}
                percentage={Math.round(
                  (gameState.score /
                    (gameState.totalQuestions * CORRECT_POINT_COST)) *
                    100
                )}
                onPlayAgain={startGame}
                onChangeDifficulty={() => setShowDifficultyDialog(true)}
                heartsModeEnabled={heartsModeEnabled}
                hearts={gameState.hearts}
              />
            ) : (
              <>
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
                    flag={gameState.currentCountry.flag}
                    countryName={gameState.currentCountry.name}
                  />
                </div>

                <AnswerOptions
                  options={gameState.options}
                  showResult={gameState.showResult}
                  handleAnswer={handleAnswer}
                  selectedAnswer={gameState.selectedAnswer}
                  getButtonClass={getButtonClass}
                  disabled={gameState.showResult}
                />

                {gameState.showResult && !settings.autoAdvanceEnabled && (
                  <div className="mb-3 sm:mb-6 text-center">
                    <Button onClick={nextQuestion} className="w-full" size="lg">
                      Next Question
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div className="flex flex-col items-center space-y-3">
          <RestartDialog
            open={showRestartDialog}
            onOpenChange={setShowRestartDialog}
            onRestart={restartGame}
            gameCompleted={gameState.gameCompleted}
          >
            <Button variant="destructive" className="w-full" size="lg">
              <RotateCcwIcon className="w-4 h-4 mr-2" />
              Restart Game
            </Button>
          </RestartDialog>

          <HowToPlayDialog
            open={showHowToPlayDialog}
            onOpenChange={setShowHowToPlayDialog}
          >
            <Button variant="ghost" className="text-muted-foreground" size="lg">
              <HelpCircleIcon className="w-4 h-4 mr-2" />
              How to play?
            </Button>
          </HowToPlayDialog>
        </div>
      </div>
    </div>
  );
};

export default FlagGameClient;
