import React from "react";
import { Difficulty } from "@/lib/constants";

interface LevelBadgeProps {
  difficulty: Difficulty;
}

const badgeStyles: Record<string, string> = {
  easy: "bg-green-100 dark:bg-green-800 border-green-700 dark:border-green-600 text-green-700 dark:text-green-100",
  medium:
    "bg-yellow-100 text-yellow-700 border-yellow-700 dark:bg-yellow-400 dark:border-yellow-900 dark:text-yellow-900",
  hard: "bg-orange-100 text-orange-700 border-orange-700 dark:bg-orange-600 dark:border-orange-800 dark:text-orange-50",
  expert:
    "bg-red-100 text-red-700 border-red-700 dark:bg-red-800 dark:border-red-600 dark:text-red-100",
};

const LevelBadge: React.FC<LevelBadgeProps> = ({ difficulty }) => (
  <div
    className={`rounded-lg flex items-center justify-center px-2 py-1 border ${badgeStyles[difficulty]}`}
  >
    <span className="text-xs font-extrabold">{difficulty.toUpperCase()}</span>
  </div>
);

export default LevelBadge;
