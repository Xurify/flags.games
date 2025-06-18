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
import { getDifficultyCountries } from "@/lib/data/difficultyCategories";
import { useGameSettings } from "@/lib/hooks/useGameSettings";
import { Shuffle, RotateCcw, Trophy } from "lucide-react";

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

const getCountriesForDifficulty = (
  difficulty: "easy" | "medium" | "hard" | "expert"
) => {
  const baseDifficulty = difficulty === "expert" ? "hard" : difficulty;
  return getDifficultyCountries(baseDifficulty);
};

const getDifficultySettings = (
  difficulty: "easy" | "medium" | "hard" | "expert"
) => {
  const countries = getCountriesForDifficulty(difficulty);
  const settings = {
    easy: { count: 15, label: "Easy (Well-known flags)" },
    medium: { count: 25, label: "Medium (Mixed difficulty)" },
    hard: {
      count: countries.length,
      label: `Hard (All ${countries.length} countries)`,
    },
    expert: {
      count: countries.length,
      label: `Expert (All ${countries.length} countries, maximum confusion)`,
    },
  };
  return settings[difficulty];
};

const getCountryRegion = (countryCode: string): string => {
  const regions = {
    europe: [
      "GB",
      "FR",
      "DE",
      "IT",
      "ES",
      "NL",
      "BE",
      "CH",
      "AT",
      "SE",
      "NO",
      "DK",
      "FI",
      "PL",
      "PT",
      "GR",
      "IS",
      "CZ",
      "HU",
      "RO",
      "BG",
      "HR",
      "SI",
      "SK",
      "EE",
      "LV",
      "LT",
      "UA",
      "BY",
      "MD",
      "RS",
      "BA",
      "ME",
      "MK",
      "AL",
      "CY",
      "MT",
      "LU",
      "MC",
      "LI",
      "SM",
      "VA",
      "AD",
      "IE",
    ],
    asia: [
      "JP",
      "CN",
      "IN",
      "KR",
      "TH",
      "VN",
      "SG",
      "MY",
      "ID",
      "PH",
      "MM",
      "KH",
      "LA",
      "MN",
      "KP",
      "KZ",
      "UZ",
      "TM",
      "KG",
      "TJ",
      "AZ",
      "AM",
      "GE",
      "AF",
      "PK",
      "BD",
      "LK",
      "NP",
      "BT",
      "MV",
      "TL",
      "BN",
    ],
    africa: [
      "EG",
      "ZA",
      "NG",
      "KE",
      "MA",
      "DZ",
      "TN",
      "LY",
      "SD",
      "SS",
      "ET",
      "ER",
      "DJ",
      "SO",
      "RW",
      "BI",
      "UG",
      "TZ",
      "MW",
      "MZ",
      "GH",
      "CI",
      "SN",
      "ML",
      "BF",
      "NE",
      "TD",
      "CM",
      "CF",
      "CD",
      "CG",
      "GA",
      "GQ",
      "AO",
      "ZM",
      "ZW",
      "BW",
      "NA",
      "LS",
      "SZ",
      "MG",
      "MU",
      "SC",
      "KM",
      "GN",
      "GW",
      "SL",
      "LR",
      "GM",
      "MR",
      "CV",
      "ST",
      "TG",
      "BJ",
    ],
    americas: [
      "US",
      "CA",
      "BR",
      "MX",
      "AR",
      "CL",
      "CO",
      "PE",
      "VE",
      "UY",
      "PY",
      "BO",
      "EC",
      "GY",
      "SR",
      "CR",
      "PA",
      "NI",
      "HN",
      "SV",
      "GT",
      "BZ",
      "JM",
      "CU",
      "HT",
      "DO",
      "TT",
      "BB",
      "LC",
      "GD",
      "VC",
      "AG",
      "DM",
      "KN",
      "BS",
    ],
    oceania: [
      "AU",
      "NZ",
      "FJ",
      "PG",
      "SB",
      "VU",
      "WS",
      "TO",
      "PW",
      "FM",
      "MH",
      "KI",
      "NR",
      "TV",
    ],
    middleEast: [
      "IL",
      "JO",
      "LB",
      "SY",
      "IQ",
      "IR",
      "SA",
      "AE",
      "QA",
      "KW",
      "BH",
      "OM",
      "YE",
      "TR",
    ],
  };

  for (const [region, codes] of Object.entries(regions)) {
    if (codes.includes(countryCode)) return region;
  }
  return "other";
};

const getSimilarFlags = (countryCode: string): string[] => {
  const similarGroups: { [name: string]: string[] } = {
    NL: ["LU", "RU", "SI", "SK"],
    LU: ["NL", "RU", "SI", "SK"],
    RU: ["NL", "LU", "SI", "SK"],
    SI: ["NL", "LU", "RU", "SK"],
    SK: ["NL", "LU", "RU", "SI"],
    ID: ["MC", "PL"],
    MC: ["ID", "PL"],
    PL: ["ID", "MC"],
    TD: ["RO"],
    RO: ["TD"],
    SE: ["NO", "DK", "FI", "IS"],
    NO: ["SE", "DK", "FI", "IS"],
    DK: ["SE", "NO", "FI", "IS"],
    FI: ["SE", "NO", "DK", "IS"],
    IS: ["SE", "NO", "DK", "FI"],
    GH: ["CM", "GN", "ML", "SN"],
    CM: ["GH", "GN", "ML", "SN"],
    GN: ["GH", "CM", "ML", "SN"],
    ML: ["GH", "CM", "GN", "SN"],
    SN: ["GH", "CM", "GN", "ML"],
    JO: ["AE", "KW", "SD", "SY"],
    AE: ["JO", "KW", "SD", "SY"],
    KW: ["JO", "AE", "SD", "SY"],
    SD: ["JO", "AE", "KW", "SY"],
    SY: ["JO", "AE", "KW", "SD"],
    FR: ["NL", "RU", "CZ", "SK"],
    CZ: ["FR", "NL", "RU", "SK"],
    AU: ["NZ", "FJ"],
    NZ: ["AU", "FJ"],
    FJ: ["AU", "NZ"],
  };

  return similarGroups[countryCode] || [];
};

const getSimilarNames = (countryName: string): string[] => {
  const nameGroups: { [name: string]: string[] } = {
    "United States": ["United Kingdom", "United Arab Emirates"],
    "United Kingdom": ["United States", "United Arab Emirates"],
    "United Arab Emirates": ["United States", "United Kingdom"],
    "North Korea": ["South Korea"],
    "South Korea": ["North Korea"],
    "Republic of the Congo": ["Democratic Republic of the Congo"],
    "Democratic Republic of the Congo": ["Republic of the Congo"],
    Guinea: ["Guinea-Bissau", "Equatorial Guinea"],
    "Guinea-Bissau": ["Guinea", "Equatorial Guinea"],
    "Equatorial Guinea": ["Guinea", "Guinea-Bissau"],
    "Saint Kitts and Nevis": [
      "Saint Lucia",
      "Saint Vincent and the Grenadines",
    ],
    "Saint Lucia": [
      "Saint Kitts and Nevis",
      "Saint Vincent and the Grenadines",
    ],
    "Saint Vincent and the Grenadines": [
      "Saint Kitts and Nevis",
      "Saint Lucia",
    ],
  };

  return nameGroups[countryName] || [];
};

const isDistinctiveFlag = (countryCode: string): boolean => {
  const distinctive = [
    "JP",
    "CA",
    "CH",
    "NP",
    "CY",
    "MK",
    "KE",
    "KW",
    "SA",
    "BD",
    "LK",
    "IN",
    "PK",
    "TR",
  ];
  return distinctive.includes(countryCode);
};

const weightedRandomSelect = (items: any[], weights: number[]) => {
  const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);
  let random = Math.random() * totalWeight;

  for (let i = 0; i < items.length; i++) {
    random -= weights[i];
    if (random <= 0) {
      return items[i];
    }
  }
  return items[items.length - 1];
};

const calculateSimilarityScore = (
  correctCountry: Country,
  candidateCountry: Country,
  difficulty: "easy" | "medium" | "hard" | "expert"
) => {
  let score = 0;
  const correctRegion = getCountryRegion(correctCountry.code);
  const candidateRegion = getCountryRegion(candidateCountry.code);
  const similarFlags = getSimilarFlags(correctCountry.code);
  const similarNames = getSimilarNames(correctCountry.name);

  if (correctRegion === candidateRegion) {
    score +=
      difficulty === "expert"
        ? 50
        : difficulty === "hard"
        ? 40
        : difficulty === "medium"
        ? 30
        : 20;
  }

  if (similarFlags.includes(candidateCountry.code)) {
    score += difficulty === "expert" ? 70 : 50;
  }

  if (similarNames.includes(candidateCountry.name)) {
    score += difficulty === "expert" ? 45 : 35;
  }

  if (
    (difficulty === "hard" || difficulty === "expert") &&
    isDistinctiveFlag(candidateCountry.code)
  ) {
    score -= difficulty === "expert" ? 50 : 30;
  }

  if (difficulty === "expert") {
    if (
      correctRegion !== candidateRegion &&
      !similarFlags.includes(candidateCountry.code) &&
      !similarNames.includes(candidateCountry.name)
    ) {
      score -= 40;
    }
  }

  score += Math.random() * (difficulty === "expert" ? 8 : 15);

  return Math.max(score, 1);
};

const FlagGame = () => {
  const { settings } = useGameSettings();

  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 1,
    score: 0,
    totalQuestions: 15,
    currentCountry: { name: "", code: "", flag: "" },
    options: [],
    selectedAnswer: null,
    showResult: false,
    gameCompleted: false,
    usedCountries: new Set(),
    difficulty: "easy",
    gameStarted: false,
  });

  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [selectedDifficulty, setSelectedDifficulty] = useState<
    "easy" | "medium" | "hard" | "expert"
  >("easy");

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playSound = (isCorrect: boolean) => {
    console.log(
      "playSound called with isCorrect:",
      isCorrect,
      "soundEffects setting:",
      settings.soundEffects
    );
    if (!settings.soundEffects) return;

    try {
      // Create audio context and play sound
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      if (isCorrect) {
        // Success sound: ascending notes
        oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
        oscillator.frequency.setValueAtTime(
          659.25,
          audioContext.currentTime + 0.1
        ); // E5
        oscillator.frequency.setValueAtTime(
          783.99,
          audioContext.currentTime + 0.2
        ); // G5
      } else {
        // Error sound: descending notes
        oscillator.frequency.setValueAtTime(493.88, audioContext.currentTime); // B4
        oscillator.frequency.setValueAtTime(
          415.3,
          audioContext.currentTime + 0.1
        ); // G#4
        oscillator.frequency.setValueAtTime(
          369.99,
          audioContext.currentTime + 0.2
        ); // F#4
      }

      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.3
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
      console.log("Sound played successfully");
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

  const generateQuestion = () => {
    const availableCountries = getCountriesForDifficulty(gameState.difficulty);

    const remainingCountries = availableCountries.filter(
      (country) => !gameState.usedCountries.has(country.code)
    );

    if (remainingCountries.length === 0) {
      setGameState((prev) => ({
        ...prev,
        gameCompleted: true,
      }));
      return;
    }

    const correctCountry =
      remainingCountries[Math.floor(Math.random() * remainingCountries.length)];

    const incorrectOptions: Country[] = [];

    const candidateCountries = availableCountries.filter(
      (c) => c.code !== correctCountry.code
    );

    const candidatesWithScores = candidateCountries.map((candidate) => ({
      country: candidate,
      score: calculateSimilarityScore(
        correctCountry,
        candidate,
        gameState.difficulty
      ),
    }));

    const minScoreThreshold = gameState.difficulty === "expert" ? 10 : 1;
    const viableCandidates = candidatesWithScores.filter(
      (c) => c.score >= minScoreThreshold
    );

    const finalCandidates =
      viableCandidates.length >= 3 ? viableCandidates : candidatesWithScores;

    while (incorrectOptions.length < 3 && finalCandidates.length > 0) {
      const availableCandidates = finalCandidates.filter(
        (c) => !incorrectOptions.find((opt) => opt.code === c.country.code)
      );

      if (availableCandidates.length === 0) break;

      const countries = availableCandidates.map((c) => c.country);
      const weights = availableCandidates.map((c) => c.score);

      const selectedCountry = weightedRandomSelect(countries, weights);
      incorrectOptions.push(selectedCountry);
    }

    while (
      incorrectOptions.length < 3 &&
      candidateCountries.length > incorrectOptions.length
    ) {
      const remainingCandidates = candidateCountries.filter(
        (c) => !incorrectOptions.find((opt) => opt.code === c.code)
      );

      if (remainingCandidates.length === 0) break;

      const nextCandidate =
        remainingCandidates[
          Math.floor(Math.random() * remainingCandidates.length)
        ];
      incorrectOptions.push(nextCandidate);
    }

    const allOptions = [correctCountry, ...incorrectOptions];
    const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);

    setGameState((prev) => ({
      ...prev,
      currentCountry: correctCountry,
      options: shuffledOptions,
      selectedAnswer: null,
      showResult: false,
      usedCountries: new Set([...prev.usedCountries, correctCountry.code]),
    }));
  };

  const handleAnswer = (selectedCountry: Country) => {
    const isCorrect = selectedCountry.code === gameState.currentCountry.code;

    console.log("handleAnswer called, playing sound...");
    // Play sound effect
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
          generateQuestion();
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
      generateQuestion();
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

    setTimeout(() => generateQuestion(), 0);
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

    setTimeout(() => generateQuestion(), 0);
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

    setTimeout(() => generateQuestion(), 0);
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

  useEffect(() => {
    if (!gameState.gameStarted) {
      startGame();
    }
  }, []);

  useEffect(() => {
    if (
      gameState.gameStarted &&
      !gameState.gameCompleted &&
      gameState.options.length === 0 &&
      gameState.currentCountry.code === ""
    ) {
      generateQuestion();
    }
  }, [
    gameState.gameStarted,
    gameState.gameCompleted,
    gameState.options.length,
    gameState.currentCountry.code,
  ]);

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
              <img
                src={gameState.currentCountry.flag}
                alt={`Flag of ${gameState.currentCountry.name}`}
                className="w-48 h-32 object-contain rounded-md"
              />
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

export default FlagGame;
