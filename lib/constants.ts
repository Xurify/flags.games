export const CORRECT_POINT_COST = 10;
export const MAX_HEARTS = 3;

export const SETTINGS_STORAGE_KEY = 'settings';

export const DEFAULT_DIFFICULTY: Difficulty = "easy";
export const EXPERT_DIFFICULTY: Difficulty = "expert";
export const HARD_DIFFICULTY: Difficulty = "hard";
export const MEDIUM_DIFFICULTY: Difficulty = "medium";

export type Difficulty = "easy" | "medium" | "hard" | "expert";
export const DIFFICULTY_LEVELS: Difficulty[] = ["easy", "medium", "hard", "expert"];

export const TIME_PER_QUESTION_OPTIONS = [10, 15, 20, 30];
export const ROOM_SIZES = [2, 3, 4, 5];

export const AUDIO_URLS = {
  BUTTON_CLICK:
    "https://qqu03sron6.ufs.sh/f/jU7cOp6GbyJPgMfH3ZgX8X5HeUlLvVymNa4CbMGB6tSrRJ7W",
  VICTORY:
    "https://qqu03sron6.ufs.sh/f/jU7cOp6GbyJPw2QMei0KClrayjzQ8DWSYEnsNML1tURiPcX0",
  CLOCK_TICK:
    "https://qqu03sron6.ufs.sh/f/jU7cOp6GbyJPiyGH6OhSgo7pEyWSMGVxaC1eZIhB6HNrbPcl",
} as const;

export const AUDIO_URLS_KEYS = {
  BUTTON_CLICK: "BUTTON_CLICK",
  VICTORY: "VICTORY",
  CLOCK_TICK: "CLOCK_TICK",
};
