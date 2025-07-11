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
  gameState: 'waiting' | 'playing' | 'paused' | 'finished';
  createdAt: string;
  createdBy: string;
  host?: string;
}

export interface RoomSettings {
  maxRoomSize: number;
  difficulty: Difficulty;
  gameMode: string;
  timePerQuestion?: number;
}

// Game State Types for multiplayer
export interface MultiplayerGameState {
  currentQuestion?: {
    id: string;
    country: Country;
    options: Country[];
    correctAnswer: string;
  };
  scores: Record<string, number>;
  timeRemaining?: number;
  roundNumber?: number;
  totalRounds?: number;
  isActive: boolean;
  answers: Record<string, string>; // userId -> answer
}

// API Response Types
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
  gameState: MultiplayerGameState;
}

export interface GameStateUpdateEvent {
  gameState: MultiplayerGameState;
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
