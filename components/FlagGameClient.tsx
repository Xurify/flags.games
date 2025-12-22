"use client";

import { useState, useEffect, useRef, Suspense, lazy } from "react";
import { useSearchParams } from "next/navigation";
import { RefreshCwIcon, HelpCircleIcon, SwordsIcon, ChevronDownIcon } from "lucide-react";
import { CORRECT_POINT_COST, MAX_HEARTS, AUDIO_URLS, AUDIO_URLS_KEYS, Difficulty } from "@/lib/constants";
import { Country } from "@/lib/data/countries";
import { useSettings } from "@/lib/context/SettingsContext";
import { useGameQueryParams } from "@/lib/hooks/useGameQueryParams";
import { generateQuestion, getDifficultySettings } from "@/lib/utils/gameLogic";
import { audioManager } from "@/lib/utils/audio-manager";
import { prefetchAllFlags } from "@/lib/utils/image";
import { useGameNavigation } from "@/lib/context/GameNavigationContext";
import { usePageReloadProtection } from "@/lib/hooks/usePageReloadProtection";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Header from "./Header";
import GameModesDialog from "./GameModesDialog";
import GameEndScreen from "./GameEndScreen";
import QuestionProgress from "./QuestionProgress";
import FlagDisplay from "./FlagDisplay";
import AnswerOptions from "./AnswerOptions";
import HowToPlayDialog from "./HowToPlayDialog";
import RestartDialog from "./RestartDialog";
import DifficultySelector from "./DifficultySelector";

export interface InitialGameData {
  currentCountry: Country;
  options: Country[];
  difficulty: Difficulty;
  totalQuestions: number;
}

interface FlagGameClientProps {
  initialGameData: InitialGameData;
  initialLimitedLifeModeEnabled?: boolean;
  initialTimeAttackModeDurationSec?: number | null;
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
  usedCountries: string[];
  difficulty: Difficulty;
  gameStarted: boolean;
  hearts: number;
}

export interface QuestionResult {
  index: number;
  countryCode: string;
  countryName: string;
  selectedCode: string | null;
  isCorrect: boolean;
  startedAtMs: number;
  answeredAtMs: number | null;
  timeToAnswerMs: number | null;
}

const FlagGameClient: React.FC<FlagGameClientProps> = ({
  initialGameData,
  initialLimitedLifeModeEnabled = false,
  initialTimeAttackModeDurationSec = null,
}) => {
  const { settings } = useSettings();
  const searchParams = useSearchParams();
  const { setDifficultyParam, setModeClassic, setModeLimited, setModeTimeAttack } = useGameQueryParams();
  const { setUnsafeToNavigate } = useGameNavigation();

  const [gameState, setGameState] = useState<GameState>({
    currentQuestion: 1,
    score: 0,
    totalQuestions: initialGameData.totalQuestions,
    currentCountry: initialGameData.currentCountry,
    options: initialGameData.options,
    selectedAnswer: null,
    showResult: false,
    gameCompleted: false,
    usedCountries: [initialGameData.currentCountry.code],
    difficulty: initialGameData.difficulty,
    gameStarted: initialTimeAttackModeDurationSec !== null ? false : true,
    hearts: MAX_HEARTS,
  });

  usePageReloadProtection({
    enabled: gameState.currentQuestion > 1 && !gameState.gameCompleted,
  });

  const [limitedLifeModeEnabled, setLimitedLifeModeEnabled] = useState(initialLimitedLifeModeEnabled);
  const [timeAttackModeDurationSec, setTimeAttackModeDurationSec] = useState<number | null>(initialTimeAttackModeDurationSec);
  const [showRestartDialog, setShowRestartDialog] = useState(false);
  const [showDifficultyDialog, setShowDifficultyDialog] = useState(false);
  const [showHowToPlayDialog, setShowHowToPlayDialog] = useState(false);
  const [showGameModesDialog, setShowGameModesDialog] = useState(false);
  const [showPointsAddedAnimation, setShowPointsAddedAnimation] = useState(false);

  const [questionResults, setQuestionResults] = useState<QuestionResult[]>([]);
  const [questionStartMs, setQuestionStartMs] = useState<number>(() => Date.now());

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    prefetchAllFlags(gameState.difficulty);
  }, [gameState.difficulty]);

  useEffect(() => {
    if (gameState.currentQuestion >= gameState.totalQuestions - 4) {
      audioManager.preloadAudio(AUDIO_URLS.VICTORY, AUDIO_URLS_KEYS.VICTORY);
    }
  }, [gameState.currentQuestion, gameState.totalQuestions]);

  useEffect(() => {
    const isProtected = gameState.currentQuestion > 1 && !gameState.gameCompleted;
    setUnsafeToNavigate(isProtected);

    return () => setUnsafeToNavigate(false);
  }, [gameState.currentQuestion, gameState.gameCompleted, setUnsafeToNavigate]);

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
      audioManager.playSuccessSound();
    } else {
      audioManager.playErrorSound();
    }
  };

  const generateQuestionHandler = (difficulty?: Difficulty) => {
    const difficultyToUse = difficulty || gameState.difficulty;
    const questionData = generateQuestion(difficultyToUse, gameState.usedCountries);

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
      usedCountries: [...prev.usedCountries, questionData.currentCountry.code],
    }));
    setQuestionStartMs(Date.now());
  };

  const handleAnswer = (selectedCountry: Country) => {
    const isCorrect = selectedCountry.code === gameState.currentCountry.code;

    playSound(isCorrect);

    const answeredAt = Date.now();
    const timeToAnswer = Math.max(0, answeredAt - questionStartMs);

    setQuestionResults((prev) => [
      ...prev,
      {
        index: gameState.currentQuestion,
        countryCode: gameState.currentCountry.code,
        countryName: gameState.currentCountry.name,
        selectedCode: selectedCountry.code,
        isCorrect,
        startedAtMs: questionStartMs,
        answeredAtMs: answeredAt,
        timeToAnswerMs: timeToAnswer,
      },
    ]);

    setGameState((prev) => {
      const newHearts = limitedLifeModeEnabled && !isCorrect ? prev.hearts - 1 : prev.hearts;
      const gameOver = limitedLifeModeEnabled && newHearts <= 0;

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
      setShowPointsAddedAnimation(true);
      setTimeout(() => setShowPointsAddedAnimation(false), 1500);
    }

    const delay = settings.autoAdvanceEnabled ? 2000 : 0;

    if (settings.autoAdvanceEnabled) {
      setGameTimeout(() => {
        const updatedHearts = limitedLifeModeEnabled && !isCorrect ? gameState.hearts - 1 : gameState.hearts;
        if (limitedLifeModeEnabled && updatedHearts <= 0) {
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

  const handleTimeUp = () => {
    if (gameState.showResult || gameState.gameCompleted) return;

    const answeredAt = Date.now();
    const timeToAnswer = Math.max(0, answeredAt - questionStartMs);

    setQuestionResults((prev) => [
      ...prev,
      {
        index: gameState.currentQuestion,
        countryCode: gameState.currentCountry.code,
        countryName: gameState.currentCountry.name,
        selectedCode: null,
        isCorrect: false,
        startedAtMs: questionStartMs,
        answeredAtMs: answeredAt,
        timeToAnswerMs: timeToAnswer,
      },
    ]);

    setGameState((prev) => {
      const newHearts = limitedLifeModeEnabled ? prev.hearts - 1 : prev.hearts;
      const gameOver = limitedLifeModeEnabled && newHearts <= 0;
      return {
        ...prev,
        selectedAnswer: null,
        showResult: true,
        hearts: newHearts,
        gameCompleted: gameOver || prev.gameCompleted,
      };
    });

    if (settings.autoAdvanceEnabled) {
      setGameTimeout(() => {
        if (gameState.currentQuestion < gameState.totalQuestions) {
          setGameState((prev) => ({
            ...prev,
            currentQuestion: prev.currentQuestion + 1,
          }));
          generateQuestionHandler();
        } else {
          setGameState((prev) => ({ ...prev, gameCompleted: true }));
        }
      }, 2000);
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
      usedCountries: [],
      gameStarted: true,
      hearts: MAX_HEARTS,
    }));

    generateQuestionHandler();
    setQuestionResults([]);
  };

  const restartGame = (requireStartPress?: boolean) => {
    clearGameTimeout();

    setGameState((prev) => ({
      ...prev,
      currentQuestion: 1,
      score: 0,
      totalQuestions: getDifficultySettings(prev.difficulty).count,
      selectedAnswer: null,
      showResult: false,
      gameCompleted: false,
      usedCountries: [],
      gameStarted: requireStartPress ? false : true,
      hearts: MAX_HEARTS,
    }));
    setShowRestartDialog(false);
    setQuestionResults([]);
    setQuestionStartMs(Date.now());
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
      usedCountries: [],
      hearts: MAX_HEARTS,
    }));

    generateQuestionHandler(newDifficulty);
    setShowDifficultyDialog(false);

    setDifficultyParam(newDifficulty);
  };

  useEffect(() => {
    const modeParam = searchParams.get("mode");
    const durationParam = searchParams.get("t");
    if (modeParam === "limited") {
      if (limitedLifeModeEnabled === false || timeAttackModeDurationSec !== null) {
        setLimitedLifeModeEnabled(true);
        setTimeAttackModeDurationSec(null);
        setGameState((prev) => ({ ...prev, gameStarted: true }));
        restartGame(false);
      }
    } else if (modeParam === "time-attack") {
      const parsed = Number(durationParam);
      const nextDuration = Number.isFinite(parsed) && parsed > 0 ? parsed : settings.timePerQuestion;
      if (limitedLifeModeEnabled === true || timeAttackModeDurationSec !== nextDuration || gameState.gameStarted === true) {
        setLimitedLifeModeEnabled(false);
        setTimeAttackModeDurationSec(nextDuration);
        setGameState((prev) => ({ ...prev, gameStarted: false }));
        restartGame(true);
      }
    } else {
      if (limitedLifeModeEnabled === true || timeAttackModeDurationSec !== null || gameState.gameStarted === false) {
        setLimitedLifeModeEnabled(false);
        setTimeAttackModeDurationSec(null);
        setGameState((prev) => ({ ...prev, gameStarted: true }));
        restartGame(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, settings.timePerQuestion]);

  useEffect(() => {
    if (gameState.gameCompleted && settings.soundEffectsEnabled) {
      const percentage = (gameState.score / (gameState.totalQuestions * CORRECT_POINT_COST)) * 100;
      if (percentage >= 60) {
        audioManager.playVictorySound();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState.gameCompleted]);

  return (
    <div className="min-h-screen w-full bg-transparent overflow-y-auto relative">
      <DifficultySelector
        open={showDifficultyDialog}
        onOpenChange={setShowDifficultyDialog}
        onChangeDifficulty={handleChangeDifficulty}
        currentDifficulty={gameState.difficulty}
        gameState={gameState}
      />

      <GameModesDialog
        open={showGameModesDialog}
        onOpenChange={setShowGameModesDialog}
        limitedLifeModeEnabled={limitedLifeModeEnabled}
        activeTimeAttackDuration={timeAttackModeDurationSec}
        onToggleLimitedLifeMode={setLimitedLifeModeEnabled}
        onRequestRestart={restartGame}
        onStartClassic={() => {
          setTimeAttackModeDurationSec(null);
          setLimitedLifeModeEnabled(false);
          restartGame(false);
          setModeClassic();
        }}
        onStartLimitedLife={() => {
          setTimeAttackModeDurationSec(null);
          setLimitedLifeModeEnabled(true);
          restartGame(false);
          setModeLimited();
        }}
        onStartTimeAttack={(durationSec) => {
          setTimeAttackModeDurationSec(durationSec);
          setLimitedLifeModeEnabled(false);
          restartGame(true);
          setModeTimeAttack(durationSec);
        }}
      />

      <RestartDialog
        open={showRestartDialog}
        onOpenChange={setShowRestartDialog}
        onRestart={restartGame}
        gameCompleted={gameState.gameCompleted}
      >
        <span />
      </RestartDialog>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-7 sm:py-6 pb-24 sm:pb-6">
        <div className="mb-4 sm:mb-0">
          <Header
            leftContent={
              <div className="flex flex-wrap items-center justify-between gap-y-3 w-full">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowRestartDialog(true)}
                    className="hover:bg-primary hover:text-primary-foreground border-transparent hover:border-foreground transition-all"
                    title="Restart Game"
                    playClickSound={true}
                  >
                    <RefreshCwIcon className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-foreground/10" />
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setShowGameModesDialog(true)}
                    className="hover:bg-primary hover:text-primary-foreground border-transparent hover:border-foreground transition-all"
                    title="Game Modes"
                    playClickSound={true}
                  >
                    <SwordsIcon className="w-4 h-4" />
                  </Button>
                  <div className="w-px h-6 bg-foreground/10" />
                  <button
                    className="flex flex-col text-left hover:bg-foreground/5 px-2 py-1 -mx-2 -my-1 rounded-md transition-all cursor-pointer group"
                    onClick={() => setShowDifficultyDialog(true)}
                  >
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground mb-0.5 group-hover:text-primary transition-colors">
                      Level
                    </span>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs sm:text-sm font-black uppercase tracking-tight">{gameState.difficulty}</span>
                      <ChevronDownIcon className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </button>
                </div>

                <div className="flex items-center gap-4 sm:gap-8">
                  <div className="flex flex-col items-center relative">
                    {showPointsAddedAnimation && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-score-popup pointer-events-none z-10 whitespace-nowrap">
                        <span className="text-green-500 font-black text-xl sm:text-2xl drop-shadow-sm">
                          +{CORRECT_POINT_COST}
                        </span>
                      </div>
                    )}
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground leading-none mb-1">
                      Score
                    </span>
                    <span className="text-xs sm:text-sm font-black text-primary">{gameState.score.toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex items-center gap-5 sm:gap-10">
                  <div className="flex flex-col items-center">
                    <span className="text-[9px] sm:text-[10px] font-mono uppercase tracking-[0.2em] text-muted-foreground leading-none mb-1">
                      Progress
                    </span>
                    <span className="text-xs sm:text-sm font-black">
                      {gameState.currentQuestion}
                      <span className="text-muted-foreground/50 mx-0.5">/</span>
                      {gameState.totalQuestions}
                    </span>
                  </div>

                  {(limitedLifeModeEnabled || timeAttackModeDurationSec !== null) && (
                    <div className="w-px h-6 bg-foreground/10" />
                  )}

                  <QuestionProgress
                    currentQuestion={gameState.currentQuestion}
                    totalQuestions={gameState.totalQuestions}
                    score={gameState.score}
                    hearts={gameState.hearts}
                    maxHearts={MAX_HEARTS}
                    limitedLifeModeEnabled={limitedLifeModeEnabled}
                    timeAttackModeEnabled={timeAttackModeDurationSec !== null}
                    timeAttackTimeSec={timeAttackModeDurationSec ?? undefined}
                    currentPhase={
                      gameState.gameCompleted
                        ? "finished"
                        : gameState.showResult
                        ? "results"
                        : timeAttackModeDurationSec !== null && !gameState.gameStarted
                        ? "waiting"
                        : "question"
                    }
                    onTimeUp={handleTimeUp}
                    startTimeMs={gameState.gameStarted ? questionStartMs : undefined}
                  />
                </div>
              </div>
            }
          />
        </div>

        {gameState.gameCompleted ? (
          <GameEndScreen
            score={gameState.score}
            totalQuestions={gameState.totalQuestions}
            onPlayAgain={startGame}
            onChangeDifficulty={() => setShowDifficultyDialog(true)}
            limitedLifeModeEnabled={limitedLifeModeEnabled}
            hearts={gameState.hearts}
            results={questionResults}
          />
        ) : (
          <>
            <Card className="mb-0 sm:mb-6 py-4 sm:py-8 px-2 sm:px-6 shadow-retro">
              <CardContent className="relative p-1 sm:p-4">
                <div className="text-center mb-4 sm:mb-8">
                  <h1 className="text-lg sm:text-xl font-black text-foreground mb-1 sm:mb-2 uppercase tracking-tight">
                    Guess the Country
                  </h1>
                  <p className="text-muted-foreground font-mono text-[12px] sm:text-xs uppercase tracking-widest leading-relaxed max-w-[280px] mx-auto sm:max-w-none">
                    Test your knowledge and identify countries by their flags
                  </p>
                </div>

                <div className="mb-4 sm:mb-8">
                  <FlagDisplay countryName={gameState.currentCountry.name} countryCode={gameState.currentCountry.code} />
                </div>

                <AnswerOptions
                  options={gameState.options}
                  showResult={gameState.showResult}
                  handleAnswer={handleAnswer}
                  selectedAnswer={gameState.selectedAnswer}
                  disabled={gameState.showResult || (timeAttackModeDurationSec !== null && !gameState.gameStarted)}
                  correctAnswer={gameState.currentCountry.code}
                />

                {timeAttackModeDurationSec !== null && !gameState.gameStarted && (
                  <div className="absolute inset-0 flex items-center justify-center bg-card rounded-md">
                    <div className="flex flex-col items-center text-center gap-3 p-4">
                      <div className="text-base font-semibold">Time Attack</div>
                      <p className="text-muted-foreground text-sm">
                        Press Start — you&apos;ll have {timeAttackModeDurationSec}s per question.
                      </p>
                      <Button
                        onClick={() => {
                          setGameState((prev) => ({
                            ...prev,
                            gameStarted: true,
                          }));
                          setQuestionStartMs(Date.now());
                          audioManager.playAudio(AUDIO_URLS.BUTTON_CLICK, {
                            volume: 1,
                            key: AUDIO_URLS_KEYS.BUTTON_CLICK,
                          });
                        }}
                        size="lg"
                      >
                        Start
                      </Button>
                    </div>
                  </div>
                )}
                {gameState.showResult && !settings.autoAdvanceEnabled && (
                  <div className="mb-3 sm:mb-6 text-center">
                    <Button onClick={nextQuestion} className="w-full" size="lg">
                      Next Question
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
            <div className="flex flex-col items-center space-y-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setShowRestartDialog(true)}
                className="w-full border-2 border-foreground shadow-retro bg-destructive text-white transition-all font-black"
                size="lg"
              >
                <RefreshCwIcon className="w-4 h-4 mr-2" />
                RESTART GAME
              </Button>

              <HowToPlayDialog open={showHowToPlayDialog} onOpenChange={setShowHowToPlayDialog}>
                <Button
                  variant="ghost"
                  className="hover:bg-transparent hover:text-foreground hover:shadow-none font-mono text-xs uppercase tracking-widest"
                  size="sm"
                >
                  <HelpCircleIcon className="w-4 h-4 mr-2" />
                  How to Play
                </Button>
              </HowToPlayDialog>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FlagGameClient;
