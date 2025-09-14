import React from "react";
import Image from "next/image";
import { Check, X } from "lucide-react";
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
  const orderedResults = [...results].sort((a, b) => a.index - b.index);

  const percentage = totalPossible === 0 ? 0 : Math.round((score / totalPossible) * 100);

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

  const elapsedMs = orderedResults.length === 0 ? null : orderedResults.reduce(
    (sum, result) => sum + (result.timeToAnswerMs ?? 0),
    0
  );

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

  return (
    <div className="py-4 sm:py-8 px-0 space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-center">
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
            {summary.correctCount}/{summary.totalQuestions}
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">
            Number of
            <br />
            Guessed Countries
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
            {elapsedClock}
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">
            Time to
            <br />
            Complete Quiz
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
            {percentage}%
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">
            overall
            <br />
            Accuracy Rate
          </div>
        </div>
        <div>
          <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums font-mono">
            {summary.longestStreak}
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-wide text-muted-foreground">
            Longest
            <br />
            Guessing Streak
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold mb-2">Questions</h3>
        <Table>
          <TableHeader className="sticky top-0 z-10">
            <TableRow>
              <TableHead className="w-12 text-right tabular-nums">#</TableHead>
              <TableHead className="min-w-[240px] text-left">Country</TableHead>
              <TableHead className="min-w-[240px] text-left">
                Your Answer
              </TableHead>
              <TableHead className="w-20 text-center">Result</TableHead>
              <TableHead className="w-24 text-right tabular-nums">
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
                  className={
                    result.isCorrect
                      ? ""
                      : "bg-destructive/6 dark:bg-destructive/15 hover:bg-destructive/30 dark:hover:bg-destructive/20"
                  }
                >
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {result.index}
                  </TableCell>
                  <TableCell className="min-w-[240px] whitespace-normal align-middle">
                    <div className="flex items-center gap-2">
                      {country && (
                        <Image
                          src={getCountryFlagIconUrl(country.code)}
                          alt=""
                          aria-hidden
                          className="max-w-full min-h-3 max-h-3 h-3 object-cover"
                          sizes="100vw"
                          style={{
                            width: "auto",
                            height: "auto",
                          }}
                          width={12}
                          height={12}
                          loading="lazy"
                        />
                      )}
                      <span>{result.countryName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="min-w-[240px] whitespace-normal align-middle">
                    {selected ? (
                      <div className="flex items-center gap-2">
                        <Image
                          src={getCountryFlagIconUrl(selected.code)}
                          alt=""
                          aria-hidden
                          className="max-w-full min-h-3 max-h-3 h-3 object-cover"
                          sizes="100vw"
                          style={{
                            width: "auto",
                            height: "auto",
                          }}
                          width={12}
                          height={12}
                          loading="lazy"
                        />
                        <span>{selected.name}</span>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">No answer</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center align-middle">
                    <div className="flex items-center justify-center">
                      {result.isCorrect ? (
                        <Check
                          className="w-4 h-4 block text-green-600 dark:text-green-500"
                          aria-label="Correct"
                        />
                      ) : (
                        <X
                          className="w-4 h-4 block text-red-600 dark:text-red-500"
                          aria-label="Wrong"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right tabular-nums align-middle">
                    {formatMs(result.timeToAnswerMs)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <Button onClick={onPlayAgain} className="w-full sm:w-auto">
          Play Again
        </Button>
        <Button
          onClick={onChangeDifficulty}
          variant="outline"
          className="w-full sm:w-auto"
        >
          Change Difficulty
        </Button>
        {limitedLifeModeEnabled && (
          <span className="text-sm text-muted-foreground">
            Hearts left: {hearts}
          </span>
        )}
      </div>
    </div>
  );
};

export default GameEndScreen;
