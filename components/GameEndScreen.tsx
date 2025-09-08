import React, { useMemo } from "react";
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
import { QuestionResult } from "./FlagGameClient";

interface GameEndScreenProps {
  score: number;
  totalPossible: number;
  onPlayAgain: () => void;
  onChangeDifficulty: () => void;
  limitedLifeModeEnabled: boolean;
  hearts: number;
  results: QuestionResult[];
}

const formatMs = (ms: number | null) => {
  if (ms === null || Number.isNaN(ms)) return "--:--";
  const totalSeconds = Math.max(0, Math.round(ms / 1000));
  const minutes = Math.floor(totalSeconds / 60).toString();
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
};

const GameEndScreen: React.FC<GameEndScreenProps> = ({
  score,
  totalPossible,
  onPlayAgain,
  onChangeDifficulty,
  limitedLifeModeEnabled,
  hearts,
  results,
}) => {
  const orderedResults = useMemo(() => {
    return [...results].sort((a, b) => a.index - b.index);
  }, [results]);

  const percentage = useMemo(() => {
    if (totalPossible === 0) return 0;
    return Math.round((score / totalPossible) * 100);
  }, [score, totalPossible]);

  const summary = useMemo(() => {
    const totalQuestions = orderedResults.length;
    const correctCount = orderedResults.filter((result) => result.isCorrect).length;
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
    return { totalQuestions, correctCount, longestStreak };
  }, [orderedResults]);

  const elapsedMs = useMemo(() => {
    if (orderedResults.length === 0) return null;
    const total = orderedResults.reduce((sum, result) => sum + (result.timeToAnswerMs ?? 0), 0);
    return total;
  }, [orderedResults]);

  const formatClock = (ms: number | null) => {
    if (ms === null || Number.isNaN(ms)) return "--:--";
    const totalSeconds = Math.max(0, Math.round(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };
  const elapsedClock = useMemo(() => formatClock(elapsedMs), [elapsedMs]);

  return (
    <div className="py-4 sm:py-8 px-4 sm:px-6 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-center">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
            {summary.correctCount}/{summary.totalQuestions}
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">
            number of
            <br />
            guessed countries
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
            {elapsedClock}
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">
            time to
            <br />
            complete quiz
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
            {percentage}%
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">
            overall
            <br />
            accuracy rate
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
            {summary.longestStreak}
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">
            longest
            <br />
            guessing streak
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-2">Questions</h3>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead className="min-w-[220px] whitespace-normal">Country</TableHead>
                <TableHead className="min-w-[220px] whitespace-normal">Your Answer</TableHead>
                <TableHead className="w-24">Result</TableHead>
                <TableHead className="w-24">Time</TableHead>
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
                    className={result.isCorrect ? "" : "bg-destructive/5"}
                  >
                    <TableCell>{result.index}</TableCell>
                    <TableCell className="min-w-[220px] whitespace-normal">
                      <div className="flex items-center gap-2">
                        {country && (
                          <img
                            src={country.flag}
                            alt=""
                            aria-hidden="true"
                            className="w-5 h-5"
                          />
                        )}
                        <span>{result.countryName}</span>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-[220px] whitespace-normal">
                      {selected ? (
                        <div className="flex items-center gap-2">
                          <img
                            src={selected.flag}
                            alt=""
                            aria-hidden="true"
                            className="w-5 h-5"
                          />
                          <span>{selected.name}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No answer</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {result.isCorrect ? (
                        <span className="text-green-600 dark:text-green-500">
                          Correct
                        </span>
                      ) : (
                        <span className="text-red-600 dark:text-red-500">
                          Wrong
                        </span>
                      )}
                    </TableCell>
                    <TableCell>{formatMs(result.timeToAnswerMs)}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button onClick={onPlayAgain} className="w-full sm:w-auto">Play Again</Button>
        <Button onClick={onChangeDifficulty} variant="outline" className="w-full sm:w-auto">Change Difficulty</Button>
        {limitedLifeModeEnabled && (
          <span className="text-sm text-muted-foreground">Hearts left: {hearts}</span>
        )}
      </div>
    </div>
  );
};

export default GameEndScreen;
