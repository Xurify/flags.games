import { Country } from "@/lib/data/countries";
import { Difficulty } from "@/lib/constants";

export interface User {
  id: string;
  username: string;
  roomId: string;
  socketId: string;
  isAdmin: boolean;
  score?: number;
}

export interface Room {
  id: string;
  name: string;
  inviteCode: string;
  members: User[];
  maxRoomSize: number;
  settings: RoomSettings;
  gameState: GameState;
  createdAt: string;
  createdBy: string;
  host?: string;
}

export interface RoomSettings {
  private?: boolean;
  maxRoomSize: number;
  difficulty: Difficulty;
  //questionCount: number;
  timePerQuestion?: number;
  //allowSpectators: boolean;
  showLeaderboard?: boolean;
  gameMode?: GameMode;
};

export type GameMode = "classic" | "speed" | "elimination";
export interface GameQuestion {
  questionNumber: number;
  country: Country;
  options: Country[];
  correctAnswer: string;
  startTime: number;
  endTime: number;
}

export interface GameAnswer {
  userId: string;
  username: string;
  answer: string;
  timeToAnswer: number;
  isCorrect: boolean;
  pointsAwarded: number;
  timestamp: number;
}


export interface GameState {
  isActive: boolean;
  isPaused: boolean;
  phase: 'waiting' | 'starting' | 'question' | 'results' | 'finished';
  currentQuestion: GameQuestion | null;
  answers: GameAnswer[];
  currentQuestionIndex: number;
  totalQuestions: number;
  difficulty: Difficulty;
  gameStartTime: number | null;
  gameEndTime: number | null;
  usedCountries: Set<string>;
  questionTimer: NodeJS.Timeout | null;
  resultTimer: NodeJS.Timeout | null;
  leaderboard: Array<{
    userId: string;
    username: string;
    score: number;
    correctAnswers: number;
    averageTime: number;
  }>;
}

export interface HealthResponse {
  status: 'ok';
  timestamp: string;
}

export interface StatsResponse {
  rooms: number;
  users: number;
  activeGames: number;
  timestamp: string;
  metrics: Record<string, unknown>;
}

export interface RoomsResponse {
  rooms: Record<string, Room>;
  count: number;
}

export interface UsersResponse {
  users: Record<string, User>;
  count: number;
}

// Event data interfaces
export interface RoomCreatedEvent {
  room: Room;
  user: User;
}

export interface RoomJoinedEvent {
  room: Room;
  user: User;
}

export interface UserJoinedEvent {
  room: Room;
  user: User;
}

export interface UserLeftEvent {
  room: Room;
  user: User;
}

export interface GameStartedEvent {
  gameState: GameState;
}

export interface GameStateUpdateEvent {
  gameState: GameState;
}

export interface AnswerSubmittedEvent {
  userId: string;
  answer: string;
  isCorrect: boolean;
  scores: Record<string, number>;
}

export interface ErrorEvent {
  message: string;
  code?: string;
}
