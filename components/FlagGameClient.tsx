"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Confetti from "react-confetti";
import {
  RotateCcw,
  HelpCircle,
  Volume2,
  VolumeX,
  Settings,
  Github,
  Sun,
  Moon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Country } from "@/lib/data/countries";
import { useGameSettings } from "@/lib/hooks/useGameSettings";
import { generateQuestion, getDifficultySettings } from "@/lib/utils/gameLogic";
import {
  CORRECT_POINT_COST,
  AUDIO_URLS,
  AUDIO_URLS_KEYS,
  Difficulty,
  DIFFICULTY_LEVELS,
  DEFAULT_DIFFICULTY,
} from "@/lib/constants";
import { useSoundEffect } from "@/lib/hooks/useSoundEffect";
import { playErrorSound, playSuccessSound } from "@/lib/utils/audioUtils";
import GameEndScreen from "./GameEndScreen";
import LevelBadge from "./LevelBadge";
import QuestionProgress from "./QuestionProgress";
import FlagDisplay from "./FlagDisplay";
import AnswerOptions from "./AnswerOptions";
import HowToPlayDialog from "./HowToPlayDialog";
import RestartDialog from "./RestartDialog";
import SettingsMenu from "./SettingsMenu";
import DifficultySelector from "./DifficultySelector";

interface InitialGameData {
  currentCountry: Country;
  options: Country[];
  difficulty: Difficulty;
  totalQuestions: number;
}

interface FlagGameClientProps {
  initialGameData: InitialGameData;
}

interface GameState {
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
}

const FlagGameClient: React.FC<FlagGameClientProps> = ({ initialGameData }) => {
  const { settings, updateSetting } = useGameSettings();
  const router = useRouter();
  const searchParams = useSearchParams();

  const { playSound: playButtonClickSound } = useSoundEffect({
    audioUrl: AUDIO_URLS.BUTTON_CLICK,
    volume: 0.5,
    cacheKey: AUDIO_URLS_KEYS.BUTTON_CLICK,
  });

  const { playSound: playVictorySound } = useSoundEffect({
    audioUrl: AUDIO_URLS.VICTORY,
    volume: 0.7,
    cacheKey: AUDIO_URLS_KEYS.VICTORY,
  });

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
  });

  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [showHowToPlayDialog, setShowHowToPlayDialog] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(
    initialGameData.difficulty
  );
  const [showScorePopup, setShowScorePopup] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  const generateQuestionHandler = () => {
    const questionData = generateQuestion(
      gameState.difficulty,
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

    setGameState((prev) => ({
      ...prev,
      selectedAnswer: selectedCountry.code,
      showResult: true,
      score: isCorrect ? prev.score + CORRECT_POINT_COST : prev.score,
    }));

    if (isCorrect) {
      setShowScorePopup(true);
      setTimeout(() => setShowScorePopup(false), 1500);
    }

    const delay = settings.autoAdvanceEnabled ? 2000 : 0;

    if (settings.autoAdvanceEnabled) {
      setGameTimeout(() => {
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
    }));

    setTimeout(() => generateQuestionHandler(), 0);
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
    }));

    setTimeout(() => generateQuestionHandler(), 0);
    setShowRestartDialog(false);
  };

  const changeDifficulty = () => {
    const newTotalQuestions = getDifficultySettings(selectedDifficulty).count;

    clearGameTimeout();

    setGameState((prev) => ({
      ...prev,
      difficulty: selectedDifficulty,
      totalQuestions: newTotalQuestions,
      currentQuestion: 1,
      score: 0,
      selectedAnswer: null,
      showResult: false,
      gameCompleted: false,
      usedCountries: new Set(),
    }));

    setTimeout(() => generateQuestionHandler(), 0);
    setShowDifficultyDialog(false);

    const params = new URLSearchParams(searchParams.toString());
    params.set("difficulty", selectedDifficulty);
    if (selectedDifficulty === DEFAULT_DIFFICULTY) {
      router.replace("/");
    } else {
      router.replace(`?${params.toString()}`);
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
    if (!gameState.showResult) {
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

  const toggleDarkMode = () => {
    const nextDark = !settings.darkMode;
    updateSetting("darkMode", nextDark);
    document.cookie = `theme=${
      nextDark ? "dark" : "light"
    }; path=/; max-age=31536000`;
    playButtonClickSound();
  };

  const toggleSound = () => {
    const newValue = !settings.soundEffectsEnabled;
    updateSetting("soundEffectsEnabled", newValue);
    playButtonClickSound();
  };

  useEffect(() => {
    if (gameState.gameCompleted && settings.soundEffectsEnabled) {
      const percentage =
        (gameState.score / (gameState.totalQuestions * CORRECT_POINT_COST)) *
        100;
      if (percentage >= 60) {
        playVictorySound();
      }
    }
  }, [gameState.gameCompleted, settings.soundEffectsEnabled]);

  return (
    <div className="min-h-screen bg-background">
      {gameState.gameCompleted && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={350}
          recycle={false}
        />
      )}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-card rounded-2xl px-4 py-2 shadow border">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-foreground">
                    LEVEL
                  </span>
                  <LevelBadge difficulty={gameState.difficulty} />
                </div>

                <div className="w-px h-6 bg-border"></div>

                <SettingsMenu
                  settingsOpen={settingsOpen}
                  setSettingsOpen={setSettingsOpen}
                  setShowDifficultyDialog={setShowDifficultyDialog}
                  toggleSound={toggleSound}
                  toggleDarkMode={toggleDarkMode}
                  settings={settings}
                />
              </div>
            </div>
          </div>

          <QuestionProgress
            currentQuestion={gameState.currentQuestion}
            totalQuestions={gameState.totalQuestions}
            score={gameState.score}
            showScorePopup={showScorePopup}
            CORRECT_POINT_COST={CORRECT_POINT_COST}
          />
        </div>

        <Card className="mb-6 shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardContent className="sm:p-4">
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
              />
            ) : (
              <>
                <div className="text-center mb-8">
                  <h1 className="text-xl font-semibold text-foreground mb-2">
                    Guess the Country
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Test your knowledge and identify countries by their flags
                  </p>
                </div>

                <div className="mb-8">
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
                  <div className="mb-6 text-center">
                    <Button onClick={nextQuestion} className="w-full" size="lg">
                      Next Question
                    </Button>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <AlertDialog
          open={showDifficultyDialog}
          onOpenChange={setShowDifficultyDialog}
        >
          <DifficultySelector
            open={showDifficultyDialog}
            onOpenChange={setShowDifficultyDialog}
            selectedDifficulty={selectedDifficulty}
            setSelectedDifficulty={setSelectedDifficulty}
            onChangeDifficulty={changeDifficulty}
            currentDifficulty={gameState.difficulty}
          />
        </AlertDialog>

        <div className="flex flex-col items-center space-y-3">
          <RestartDialog
            open={showRestartDialog}
            onOpenChange={setShowRestartDialog}
            onRestart={restartGame}
            gameCompleted={gameState.gameCompleted}
          >
            <Button variant="destructive" className="w-full" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Restart Game
            </Button>
          </RestartDialog>

          <HowToPlayDialog open={showHowToPlayDialog} onOpenChange={setShowHowToPlayDialog}>
            <Button
              variant="ghost"
              className="text-muted-foreground"
              size="lg"
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              How to play?
            </Button>
          </HowToPlayDialog>
        </div>
      </div>
    </div>
  );
};

export default FlagGameClient;
