export const CORRECT_POINT_COST = 1;
export const MAX_HEARTS = 3;

export type Difficulty = "easy" | "medium" | "hard" | "expert";

export const DIFFICULTY_LEVELS: Difficulty[] = ["easy", "medium", "hard", "expert"];

export const DEFAULT_DIFFICULTY: Difficulty = "easy";
export const EXPERT_DIFFICULTY: Difficulty = "expert";
export const HARD_DIFFICULTY: Difficulty = "hard";
export const MEDIUM_DIFFICULTY: Difficulty = "medium";

export const AUDIO_URLS = {
  BUTTON_CLICK:
    "https://qqu03sron6.ufs.sh/f/jU7cOp6GbyJPgMfH3ZgX8X5HeUlLvVymNa4CbMGB6tSrRJ7W",
  VICTORY:
    "https://qqu03sron6.ufs.sh/f/jU7cOp6GbyJPw2QMei0KClrayjzQ8DWSYEnsNML1tURiPcX0",
} as const;

export const AUDIO_URLS_KEYS = {
  BUTTON_CLICK: "BUTTON_CLICK",
  VICTORY: "VICTORY",
};
