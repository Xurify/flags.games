"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Shuffle, RotateCcw, Trophy } from "lucide-react";
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
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard" | "expert"
  >("easy");

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
      score: isCorrect ? prev.score + 1 : prev.score,
    }));

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
    if (!gameState.showResult) return "";
    if (country.code === gameState.currentCountry.code)
      return "bg-green-100 border-green-500 text-green-800 hover:bg-green-200";
    if (
      country.code === gameState.selectedAnswer &&
      country.code !== gameState.currentCountry.code
    ) {
      return "bg-red-100 border-red-500 text-red-800 hover:bg-red-200";
    }
    return "opacity-50";
  };

  useEffect(() => {
    return () => {
      clearGameTimeout();
    };
  }, []);

  if (gameState.gameCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Trophy className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
            <CardTitle className="text-2xl">Congratulations!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div>
              <p className="text-lg mb-2">
                You've completed the{" "}
                {getDifficultySettings(gameState.difficulty).label} challenge!
              </p>
              <p className="text-3xl font-bold text-primary">
                {gameState.score} / {gameState.totalQuestions}
              </p>
              <p className="text-lg text-gray-600">
                {Math.round((gameState.score / gameState.totalQuestions) * 100)}
                % Correct
              </p>
            </div>
            <p className="text-sm text-gray-700">{getScoreMessage()}</p>
            <div className="space-y-2">
              <Button onClick={startGame} className="w-full" size="lg">
                <RotateCcw className="w-4 h-4 mr-2" />
                Play Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="p-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              Question {gameState.currentQuestion} of {gameState.totalQuestions}
            </Badge>
            <Badge variant="outline" className="text-lg px-4 py-2">
              Score: {gameState.score}
            </Badge>
          </div>

          <div className="mb-6 text-center">
            <h1 className="text-2xl font-semibold text-gray-900">
              Which country does this flag belong to?
            </h1>
          </div>

          <div className="mb-6 p-8 bg-gray-50 rounded-lg">
            <div className="flex justify-center">
              {gameState.currentCountry.flag ? (
                <img
                  src={gameState.currentCountry.flag}
                  alt={`Flag of ${gameState.currentCountry.name}`}
                  className="w-48 h-32 object-contain rounded-md"
                />
              ) : (
                <div className="w-48 h-32 bg-gray-200 rounded-md flex items-center justify-center">
                  <span className="text-gray-500">Loading...</span>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gameState.options.map((country) => (
              <Button
                key={country.code}
                onClick={() => !gameState.showResult && handleAnswer(country)}
                disabled={gameState.showResult}
                className={`h-16 text-lg font-medium border-2 ${getButtonClass(
                  country
                )}`}
                variant="outline"
              >
                {country.name}
              </Button>
            ))}
          </div>

          {gameState.showResult && (
            <Card className="mt-6">
              <CardContent className="pt-6 text-center">
                {gameState.selectedAnswer === gameState.currentCountry.code ? (
                  <p className="text-green-600 font-semibold text-lg">
                    ✅ Correct! Well done!
                  </p>
                ) : (
                  <p className="text-red-600 font-semibold text-lg">
                    ❌ Incorrect. The correct answer was{" "}
                    {gameState.currentCountry.name}
                  </p>
                )}
                {!settings.autoAdvance && (
                  <Button onClick={nextQuestion} className="mt-4">
                    Next Question
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          <div className="mt-6 text-center flex gap-4 justify-center">
            <AlertDialog
              open={showRestartDialog}
              onOpenChange={setShowRestartDialog}
            >
              <AlertDialogTrigger asChild>
                <Button variant="outline">
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

            <AlertDialog
              open={showDifficultyDialog}
              onOpenChange={setShowDifficultyDialog}
            >
              <AlertDialogTrigger asChild>
                <Button variant="outline">
                  <Shuffle className="w-4 h-4 mr-2" />
                  Change Difficulty:{" "}
                  {
                    getDifficultySettings(gameState.difficulty).label.split(
                      " "
                    )[0]
                  }
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlagGameClient;
