"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import { Shuffle, RotateCcw, Trophy, HelpCircle } from "lucide-react";
import {
  generateQuestion,
  getDifficultySettings,
  QuestionData
} from "@/lib/utils/gameLogic";

interface InitialGameData {
  currentCountry: Country;
  options: Country[];
  difficulty: "easy" | "medium" | "hard" | "expert";
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
  difficulty: "easy" | "medium" | "hard" | "expert";
  gameStarted: boolean;
}

const FlagGameClient: React.FC<FlagGameClientProps> = ({ initialGameData }) => {
  const { settings } = useGameSettings();

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
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard" | "expert"
  >("easy");
  const [showScorePopup, setShowScorePopup] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playSound = (isCorrect: boolean) => {
    if (!settings.soundEffects) return;

    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (isCorrect) {
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          659.25,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
          783.99,
          audioContext.currentTime + 0.2
        );
      } else {
        oscillator.frequency.setValueAtTime(493.88, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(
          415.3,
          audioContext.currentTime + 0.1
        );
        oscillator.frequency.setValueAtTime(
          369.99,
          audioContext.currentTime + 0.2
        );
      }

      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

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

  const generateQuestionHandler = () => {
    const questionData = generateQuestion(gameState.difficulty, gameState.usedCountries);

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
      usedCountries: new Set([...prev.usedCountries, questionData.currentCountry.code]),
    }));
  };

  const handleAnswer = (selectedCountry: Country) => {
    const isCorrect = selectedCountry.code === gameState.currentCountry.code;

    playSound(isCorrect);

    setGameState((prev) => ({
      ...prev,
      selectedAnswer: selectedCountry.code,
      showResult: true,
      score: isCorrect ? prev.score + 500 : prev.score,
    }));

    if (isCorrect) {
      setShowScorePopup(true);
      setTimeout(() => setShowScorePopup(false), 1500);
    }

    const delay = settings.autoAdvance ? 2000 : 0;

    if (settings.autoAdvance) {
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
  };

  const getScoreMessage = () => {
    const percentage = (gameState.score / gameState.totalQuestions) * 100;
    if (percentage >= 90) return "Excellent! You're a geography expert! 🌟";
    if (percentage >= 75) return "Great job! You know your flags well! 🎉";
    if (percentage >= 60) return "Good work! Keep practicing! 👍";
    if (percentage >= 40) return "Not bad! There's room for improvement! 💪";
    return "Keep learning! Practice makes perfect! 📚";
  };

  const getButtonClass = (country: Country) => {
    if (!gameState.showResult) {
      return "border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-200";
    }

    if (country.code === gameState.currentCountry.code) {
      return "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 shadow-soft";
    }

    if (
      country.code === gameState.selectedAnswer &&
      country.code !== gameState.currentCountry.code
    ) {
      return "bg-red-50 border-red-200 text-red-700 hover:bg-red-100 shadow-soft";
    }

    return "opacity-40 border-border/50";
  };

  useEffect(() => {
    return () => {
      clearGameTimeout();
    };
  }, []);

  if (gameState.gameCompleted) {
    const percentage = Math.round((gameState.score / gameState.totalQuestions) * 100);

    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
          <Card className="shadow-card-hover">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-primary" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Congratulations!
                </h1>
                <p className="text-muted-foreground">
                  You've completed the {getDifficultySettings(gameState.difficulty).label.toLowerCase()} challenge!
                </p>
              </div>

              <div className="mb-8">
                <div className="bg-muted/30 rounded-2xl p-6 mb-4">
                  <div className="text-4xl font-bold text-primary mb-2">
                    {gameState.score} / {gameState.totalQuestions}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    {percentage}% Correct
                  </div>
                </div>

                <div className="text-sm text-muted-foreground">
                  {getScoreMessage()}
                </div>
              </div>
              <Button
                onClick={startGame}
                className="w-full shadow-button"
                size="lg"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6">
        <div className="mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="bg-card rounded-2xl px-4 py-2 shadow-soft border border-border/50">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">
                  LEVEL
                </span>
                <div className={`rounded-lg flex items-center justify-center px-2 py-1 ${
                  gameState.difficulty === 'easy' ? 'bg-green-100' :
                  gameState.difficulty === 'medium' ? 'bg-yellow-100' :
                  gameState.difficulty === 'hard' ? 'bg-orange-100' : 'bg-red-100'
                }`}>
                  <span className={`text-xs font-bold ${
                    gameState.difficulty === 'easy' ? 'text-green-700' :
                    gameState.difficulty === 'medium' ? 'text-yellow-700' :
                    gameState.difficulty === 'hard' ? 'text-orange-700' : 'text-red-700'
                  }`}>
                    {gameState.difficulty.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span className="text-sm font-medium text-muted-foreground">
                Question {gameState.currentQuestion} of {gameState.totalQuestions}
              </span>
            </div>
            <div className="relative">
              <Badge variant="secondary" className="text-sm px-3 py-1 rounded-full">
                Score: {gameState.score}
              </Badge>
              {showScorePopup && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 animate-score-popup">
                  <span className="text-green-600 font-bold text-lg">+500</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <Card className="mb-6 shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardContent className="sm:p-4">
            <div className="text-center mb-8">
              <h1 className="text-xl font-semibold text-foreground mb-2">
                Guess the Country
              </h1>
              <p className="text-muted-foreground text-sm">
                Test your knowledge and identify countries by their flags
              </p>
            </div>

            <div className="mb-8">
              <div className="bg-muted/80 rounded-2xl p-4 sm:p-8 flex justify-center items-center min-h-[160px] sm:min-h-[200px]">
                {gameState.currentCountry.flag ? (
                  <img
                    src={gameState.currentCountry.flag}
                    alt={`Flag of ${gameState.currentCountry.name}`}
                    className="max-w-full max-h-28 sm:max-h-32 object-contain rounded-sm shadow-flag"
                  />
                ) : (
                  <div className="w-40 h-24 sm:w-48 sm:h-32 bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Loading...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {gameState.options.map((country) => (
                <Button
                  key={country.code}
                  onClick={() => !gameState.showResult && handleAnswer(country)}
                  disabled={gameState.showResult}
                  className={`h-14 text-base font-medium justify-start px-6 ${getButtonClass(
                    country
                  )}`}
                  variant="outline"
                >
                  {country.name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {gameState.showResult && !settings.autoAdvance && (
          <div className="mb-6 text-center">
            <Button onClick={nextQuestion} className="w-full" size="lg">
              Next Question
            </Button>
          </div>
        )}

        <div className="space-y-3">
          <AlertDialog
            open={showRestartDialog}
            onOpenChange={setShowRestartDialog}
          >
            <AlertDialogTrigger asChild>
              <Button variant="destructive" className="w-full" size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Restart Game
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Restart Game</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to restart the game? Your current
                  progress will be lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={restartGame}>
                  Restart
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="grid grid-cols-2 gap-3">
            <AlertDialog
              open={showDifficultyDialog}
              onOpenChange={setShowDifficultyDialog}
            >
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="text-muted-foreground" size="lg">
                  <Shuffle className="w-4 h-4 mr-2" />
                  Level {gameState.difficulty === 'easy' ? '1' :
                         gameState.difficulty === 'medium' ? '2' :
                         gameState.difficulty === 'hard' ? '3' : '4'}
                </Button>
              </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Change Difficulty</AlertDialogTitle>
                <AlertDialogDescription>
                  Select a new difficulty level. Your current progress will be
                  lost.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="my-4">
                <Select
                  value={selectedDifficulty}
                  onValueChange={(
                    value: "easy" | "medium" | "hard" | "expert"
                  ) => setSelectedDifficulty(value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">
                      {getDifficultySettings("easy").label}
                    </SelectItem>
                    <SelectItem value="medium">
                      {getDifficultySettings("medium").label}
                    </SelectItem>
                    <SelectItem value="hard">
                      {getDifficultySettings("hard").label}
                    </SelectItem>
                    <SelectItem value="expert">
                      {getDifficultySettings("expert").label}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={changeDifficulty}>
                  Change Difficulty
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog
            open={showHowToPlayDialog}
            onOpenChange={setShowHowToPlayDialog}
          >
            <AlertDialogTrigger asChild>
              <Button variant="ghost" className="text-muted-foreground" size="lg">
                <HelpCircle className="w-4 h-4 mr-2" />
                How to play?
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-md">
              <AlertDialogHeader>
                <AlertDialogTitle>How to Play</AlertDialogTitle>
                <AlertDialogDescription asChild>
                  <div className="space-y-4 text-sm">
                    <div>
                      <h4 className="font-medium text-foreground mb-2">🎯 Objective</h4>
                      <p>Identify the country that each flag belongs to by selecting the correct answer from the multiple choice options.</p>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">🎮 How to Play</h4>
                      <ul className="space-y-1 list-disc list-inside">
                        <li>Look at the flag displayed</li>
                        <li>Choose the correct country from the options</li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-medium text-foreground mb-2">📊 Difficulty Levels</h4>
                      <ul className="space-y-1">
                        <li><span className="inline-block w-3 h-3 bg-green-400 rounded mr-2"></span><strong>Level 1:</strong> Well-known flags (15 countries)</li>
                        <li><span className="inline-block w-3 h-3 bg-yellow-400 rounded mr-2"></span><strong>Level 2:</strong> Medium mode (25 countries)</li>
                        <li><span className="inline-block w-3 h-3 bg-orange-400 rounded mr-2"></span><strong>Level 3:</strong> Hard mode (194 countries - challenging)</li>
                        <li><span className="inline-block w-3 h-3 bg-red-400 rounded mr-2"></span><strong>Level 4:</strong> Expert mode (194 countries - maximum confusion)</li>
                      </ul>
                    </div>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogAction>Got it!</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
        </div>
      </div>
    </div>
  );
};

export default FlagGameClient;
