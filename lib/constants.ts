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
  BUTTON_CLICK: "/private/digital-pop.mp3",
  VICTORY: "/private/victory.mp3", 
  CLOCK_TICK: "/private/tick.mp3",
} as const;

export const AUDIO_URLS_KEYS = {
  BUTTON_CLICK: "BUTTON_CLICK",
  VICTORY: "VICTORY",
  CLOCK_TICK: "CLOCK_TICK",
};
