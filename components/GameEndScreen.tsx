"use client";

import React, { lazy, Suspense } from "react";
import Image from "next/image";
import { Check, X, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getCountryByCode } from "@/lib/data/countries";
import { getCountryFlagIconUrl } from "@/lib/utils/image";
import { QuestionResult } from "./FlagGameClient";
import { cn } from "@/lib/utils/strings";

const Confetti = lazy(() => import("react-confetti"));

interface GameEndScreenProps {
  score: number;
  totalPossible: number;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
  limitedLifeModeEnabled: boolean;
  hearts: number;
  results: QuestionResult[];
}

const GameEndScreen: React.FC<GameEndScreenProps> = ({
  score,
  totalPossible,
  onPlayAgain,
  onChangeDifficulty,
  limitedLifeModeEnabled,
  hearts,
  results,
}) => {
  const orderedResults = [...results].sort((a, b) => a.index - b.index);

  const percentage =
    totalPossible === 0 ? 0 : Math.round((score / totalPossible) * 100);

  const totalQuestions = orderedResults.length;
  const correctCount = orderedResults.filter(
    (result) => result.isCorrect
  ).length;
  let currentStreak = 0;
  let longestStreak = 0;
  for (const result of orderedResults) {
    if (result.isCorrect) {
      currentStreak += 1;
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    } else {
      currentStreak = 0;
    }
  }
  const summary = { totalQuestions, correctCount, longestStreak };

  const elapsedMs =
    orderedResults.length === 0
      ? null
      : orderedResults.reduce((sum, result) => sum + (result.timeToAnswerMs ?? 0), 0);

  const formatClock = (ms: number | null) => {
    if (ms === null || Number.isNaN(ms)) return "--:--";
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  const elapsedClock = formatClock(elapsedMs);

  const formatMs = (ms: number | null) => {
    if (ms === null || Number.isNaN(ms)) return "--:--";
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60).toString();
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const isPerfect = score === totalPossible && totalPossible > 0;

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl mx-auto py-3">
      {isPerfect && (
        <Suspense fallback={null}>
          <Confetti
            width={window.innerWidth - 100}
            height={window.innerHeight}
            numberOfPieces={350}
            recycle={false}
            className="w-full h-full fixed inset-0 z-50 pointer-events-none"
          />
        </Suspense>
      )}

      <div className="flex flex-col gap-2 text-center">
        <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground leading-[0.9] uppercase">
          Final
          <br />
          <span className="text-destructive whitespace-nowrap">Results</span>
        </h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "CORRECT",
            value: `${summary.correctCount}/${summary.totalQuestions}`,
            highlight: isPerfect,
          },
          {
            label: "TIME",
            value: elapsedClock,
          },
          {
            label: "ACCURACY",
            value: `${percentage}%`,
          },
          {
            label: "BEST STREAK",
            value: summary.longestStreak,
          },
        ].map((stat, i) => (
          <div
            key={i}
            className={cn(
              "p-6 border-2 border-foreground shadow-retro flex flex-col items-center justify-center text-center",
              stat.highlight
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground"
            )}
          >
            <span className="font-mono text-[10px] uppercase font-bold opacity-70 mb-1">
              {stat.label}
            </span>
            <span className="text-3xl font-black tracking-tighter leading-none">
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <h3 className="text-2xl font-black tracking-tight uppercase border-b-2 border-foreground pb-2">
          Details
        </h3>
        <div className="border-2 border-foreground shadow-retro overflow-hidden">
          <Table>
            <TableHeader className="bg-muted">
              <TableRow className="hover:bg-transparent border-b-2 border-foreground">
                <TableHead className="w-16 font-black text-foreground uppercase tracking-wider text-center">
                  #
                </TableHead>
                <TableHead className="font-black text-foreground uppercase tracking-wider">
                  Question
                </TableHead>
                <TableHead className="font-black text-foreground uppercase tracking-wider">
                  Answer
                </TableHead>
                <TableHead className="w-20 font-black text-foreground uppercase tracking-wider text-center">
                  Result
                </TableHead>
                <TableHead className="w-24 font-black text-foreground uppercase tracking-wider text-right">
                  Time
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderedResults.map((result) => {
                const country = getCountryByCode(result.countryCode);
                const selected = result.selectedCode
                  ? getCountryByCode(result.selectedCode)
                  : null;
                return (
                  <TableRow
                    key={result.index}
                    className={cn(
                      "group border-b-2 border-foreground last:border-0",
                      result.isCorrect ? "bg-card" : "bg-red-500/10"
                    )}
                  >
                    <TableCell className="text-xl font-black tracking-tighter text-foreground/20 group-hover:text-foreground/40 text-center transition-colors italic tabular-nums">
                      {result.index}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {country && (
                          <div className="relative w-8 h-6 shadow-sm border border-foreground/10 overflow-hidden rounded-[2px]">
                            <Image
                              src={getCountryFlagIconUrl(country.code)}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          </div>
                        )}
                        <span className="font-bold text-foreground">
                          {result.countryName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {selected ? (
                        <div className="flex items-center gap-3">
                          <div className="relative w-8 h-6 shadow-sm border border-foreground/10 overflow-hidden rounded-[2px]">
                            <Image
                              src={getCountryFlagIconUrl(selected.code)}
                              alt=""
                              fill
                              className="object-cover"
                              sizes="32px"
                            />
                          </div>
                          <span className="font-bold text-foreground">
                            {selected.name}
                          </span>
                        </div>
                      ) : (
                        <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                          No answer
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center">
                        {result.isCorrect ? (
                          <Check
                            className="w-6 h-6 text-green-600 dark:text-green-500 stroke-[3]"
                            aria-label="Correct"
                          />
                        ) : (
                          <X
                            className="w-6 h-6 text-red-600 dark:text-red-500 stroke-[3]"
                            aria-label="Wrong"
                          />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-bold text-muted-foreground tabular-nums">
                      {formatMs(result.timeToAnswerMs)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button
          onClick={onPlayAgain}
          className="w-full sm:w-auto h-16 px-12 text-xl font-black tracking-tighter bg-primary text-primary-foreground shadow-retro border-2 border-foreground active:translate-x-1 active:translate-y-1 active:shadow-none hover:bg-primary/90"
        >
          PLAY AGAIN
        </Button>
        <Button
          onClick={onChangeDifficulty}
          variant="outline"
          className="w-full sm:w-auto h-16 px-12 text-xl font-black tracking-tighter shadow-retro border-2 border-foreground active:translate-x-1 active:translate-y-1 active:shadow-none bg-background hover:bg-muted"
        >
          CHANGE DIFFICULTY
        </Button>
        {limitedLifeModeEnabled && (
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-muted-foreground bg-muted/50 px-4 py-2 rounded-full">
            <span>Hearts Left:</span>
            <span className="text-red-500 font-bold text-sm">{hearts}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameEndScreen;
