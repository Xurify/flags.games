import React from "react";
import { Difficulty } from "@/lib/constants";

interface LevelBadgeProps {
  difficulty: Difficulty;
}

const badgeStyles: Record<string, string> = {
  easy: "bg-green-100 dark:bg-green-800 border-green-700 dark:border-green-600 text-green-700 dark:text-green-100",
  medium:
    "bg-yellow-100 border-yellow-700 dark:border-yellow-600 text-yellow-700",
  hard: "bg-orange-100 border-orange-700 dark:border-orange-600 text-orange-700",
  expert: "bg-red-100 border-red-700 dark:border-red-600 text-red-700",
};

const LevelBadge: React.FC<LevelBadgeProps> = ({ difficulty }) => (
  <div
    className={`rounded-lg flex items-center justify-center px-2 py-1 border ${badgeStyles[difficulty]}`}
  >
    <span
      className={`text-xs font-extrabold ${badgeStyles[difficulty]
        .split(" ")
        .pop()}`}
    >
      {difficulty.toUpperCase()}
    </span>
  </div>
);

export default LevelBadge;
