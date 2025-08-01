import { Country } from "@/lib/data/countries";
import { Difficulty } from "@/lib/constants";

export interface User {
  id: string;
  socketId: string;
  username: string;
  roomId: string;
  created: string;
  isAdmin: boolean;
  score: number;
  currentAnswer?: string;
  answerTime?: number;
  lastActiveTime: string;
}

export interface GameQuestion {
  questionNumber: number;
  country: Country;
  options: Country[];
  correctAnswer: string;
  startTime: number;
  endTime: number;
  timeLimit: number;
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

export interface GameStateLeaderboard {
  userId: string;
  username: string;
  score: number;
  correctAnswers: number;
  averageTime: number;
}

export type GamePhase = "waiting" | "starting" | "question" | "results" | "finished";

export interface GameState {
  isActive: boolean;
  phase: GamePhase;
  currentQuestion: GameQuestion | null;
  answers: GameAnswer[];
  currentQuestionIndex: number;
  totalQuestions: number;
  difficulty: Difficulty;
  gameStartTime: number | null;
  gameEndTime: number | null;
  usedCountries: Set<string>;
  questionTimer: Timer | null;
  resultTimer: Timer | null;
  leaderboard: GameStateLeaderboard[];
}

export interface Timer {
  startTime: number;
  duration: number;
  endTime: number;
}

export interface RoomSettings {
  maxRoomSize: number;
  difficulty: Difficulty;
  timePerQuestion?: number;
  showLeaderboard?: boolean;
  gameMode: GameMode;
}

export type GameMode = "classic" | "speed" | "elimination";

export interface Room {
  id: string;
  name: string;
  host: string;
  inviteCode: string;
  gameState: GameState;
  members: User[];
  created: string;
  settings: RoomSettings;
}

export const WS_MESSAGE_TYPES = {
  AUTH: "AUTH",
  AUTH_SUCCESS: "AUTH_SUCCESS",
  SUBMIT_ANSWER: "SUBMIT_ANSWER",
  START_GAME: "START_GAME",
  JOIN_ROOM: "JOIN_ROOM",
  CREATE_ROOM: "CREATE_ROOM",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  KICK_USER: "KICK_USER",
  LEAVE_ROOM: "LEAVE_ROOM",
  RESUME_GAME: "RESUME_GAME",
  STOP_GAME: "STOP_GAME",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  TOGGLE_READY: "TOGGLE_READY",
  HEARTBEAT: "HEARTBEAT",
  HEARTBEAT_RESPONSE: "HEARTBEAT_RESPONSE",
  CREATE_ROOM_SUCCESS: "CREATE_ROOM_SUCCESS",
  JOIN_ROOM_SUCCESS: "JOIN_ROOM_SUCCESS",
  USER_JOINED: "USER_JOINED",
  USER_LEFT: "USER_LEFT",
  HOST_CHANGED: "HOST_CHANGED",
  KICKED: "KICKED",
  GAME_STARTING: "GAME_STARTING",
  NEW_QUESTION: "NEW_QUESTION",
  ANSWER_SUBMITTED: "ANSWER_SUBMITTED",
  QUESTION_RESULTS: "QUESTION_RESULTS",
  GAME_ENDED: "GAME_ENDED",
  GAME_STOPPED: "GAME_STOPPED",
  SETTINGS_UPDATED: "SETTINGS_UPDATED",
  PROFILE_UPDATED: "PROFILE_UPDATED",
  USER_PROFILE_UPDATED: "USER_PROFILE_UPDATED",
  USER_READY_CHANGED: "USER_READY_CHANGED",
  CONNECTION_ESTABLISHED: "CONNECTION_ESTABLISHED",
  ERROR: "ERROR",
} as const;

export type WSMessageType = typeof WS_MESSAGE_TYPES[keyof typeof WS_MESSAGE_TYPES];

export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp?: number;
}

export interface AuthData {
  token: string;
  adminToken?: string;
}

export interface CreateRoomData {
  username: string;
  userId: string;
  roomName: string;
  settings?: Partial<RoomSettings>;
}

export interface JoinRoomData {
  inviteCode: string;
  username: string;
  userId: string;
}

export interface SubmitAnswerData {
  answer: string;
  questionId: string;
}

export interface UpdateSettingsData {
  settings: Partial<RoomSettings>;
}

export interface KickUserData {
  userId: string;
}

export interface UpdateProfileData {
  color?: string;
  username?: string;
}

export interface ToggleReadyData {
  isReady: boolean;
}

export interface AuthSuccessData {
  userId: string;
  isAdmin: boolean;
  user: User;
  room: Room;
}

export interface RoomSuccessData {
  room: Room;
  user: User;
}

export interface UserJoinedData {
  user: User;
  room: Room;
}

export interface UserLeftData {
  userId: string;
  room: Room | null;
}

export interface HostChangedData {
  newHost: User;
}

export interface KickedData {
  reason: string;
}

export interface GameStartingData {
  gameState: GameState;
}

export interface NewQuestionData {
  question: GameQuestion;
}

export interface AnswerSubmittedData {
  userId: string;
  username: string;
  answer: string;
  isCorrect: boolean;
  timeToAnswer: number;
  pointsAwarded: number;
}

export interface QuestionResultsData {
  playerAnswers: GameAnswer[];
  leaderboard: GameStateLeaderboard[];
}

export interface GameEndedData {
  leaderboard: GameStateLeaderboard[];
}

export interface SettingsUpdatedData {
  settings: RoomSettings;
}

export interface ProfileUpdatedData {
  user: User;
}

export interface UserProfileUpdatedData {
  userId: string;
  username: string;
}

export interface UserReadyChangedData {
  userId: string;
  isReady: boolean;
}

export interface ConnectionEstablishedData {
  timestamp: number;
}

export interface ErrorData {
  message: string;
  code?: string;
  details?: any;
}

export type ClientToServerMessage = 
  | { type: typeof WS_MESSAGE_TYPES.AUTH; data: AuthData }
  | { type: typeof WS_MESSAGE_TYPES.CREATE_ROOM; data: CreateRoomData }
  | { type: typeof WS_MESSAGE_TYPES.JOIN_ROOM; data: JoinRoomData }
  | { type: typeof WS_MESSAGE_TYPES.SUBMIT_ANSWER; data: SubmitAnswerData }
  | { type: typeof WS_MESSAGE_TYPES.UPDATE_SETTINGS; data: UpdateSettingsData }
  | { type: typeof WS_MESSAGE_TYPES.KICK_USER; data: KickUserData }
  | { type: typeof WS_MESSAGE_TYPES.UPDATE_PROFILE; data: UpdateProfileData }
  | { type: typeof WS_MESSAGE_TYPES.TOGGLE_READY; data: ToggleReadyData }
  | { type: typeof WS_MESSAGE_TYPES.LEAVE_ROOM; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.START_GAME; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.RESUME_GAME; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.STOP_GAME; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.HEARTBEAT_RESPONSE; data: {} };

export type ServerToClientMessage =
  | { type: typeof WS_MESSAGE_TYPES.AUTH_SUCCESS; data: AuthSuccessData }
  | { type: typeof WS_MESSAGE_TYPES.CREATE_ROOM_SUCCESS; data: RoomSuccessData }
  | { type: typeof WS_MESSAGE_TYPES.JOIN_ROOM_SUCCESS; data: RoomSuccessData }
  | { type: typeof WS_MESSAGE_TYPES.USER_JOINED; data: UserJoinedData }
  | { type: typeof WS_MESSAGE_TYPES.USER_LEFT; data: UserLeftData }
  | { type: typeof WS_MESSAGE_TYPES.HOST_CHANGED; data: HostChangedData }
  | { type: typeof WS_MESSAGE_TYPES.KICKED; data: KickedData }
  | { type: typeof WS_MESSAGE_TYPES.GAME_STARTING; data: GameStartingData }
  | { type: typeof WS_MESSAGE_TYPES.NEW_QUESTION; data: NewQuestionData }
  | { type: typeof WS_MESSAGE_TYPES.ANSWER_SUBMITTED; data: AnswerSubmittedData }
  | { type: typeof WS_MESSAGE_TYPES.QUESTION_RESULTS; data: QuestionResultsData }
  | { type: typeof WS_MESSAGE_TYPES.GAME_ENDED; data: GameEndedData }
  | { type: typeof WS_MESSAGE_TYPES.GAME_STOPPED; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.SETTINGS_UPDATED; data: SettingsUpdatedData }
  | { type: typeof WS_MESSAGE_TYPES.ERROR; data: ErrorData }
  | { type: typeof WS_MESSAGE_TYPES.HEARTBEAT; data: {} };

