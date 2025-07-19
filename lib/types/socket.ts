import { GameStateLeaderboard, RoomSettings } from './multiplayer';

export const WS_MESSAGE_TYPES = {
  // Client-to-server message types
  AUTH: "AUTH",
  AUTH_SUCCESS: "AUTH_SUCCESS",
  SUBMIT_ANSWER: "SUBMIT_ANSWER",
  START_GAME: "START_GAME",
  JOIN_ROOM: "JOIN_ROOM",
  CREATE_ROOM: "CREATE_ROOM",
  UPDATE_SETTINGS: "UPDATE_SETTINGS",
  KICK_USER: "KICK_USER",
  LEAVE_ROOM: "LEAVE_ROOM",
  
  PAUSE_GAME: "PAUSE_GAME",
  RESUME_GAME: "RESUME_GAME",
  STOP_GAME: "STOP_GAME",
  HEARTBEAT_RESPONSE: "HEARTBEAT_RESPONSE",
  SKIP_QUESTION: "SKIP_QUESTION",
  REACTION: "REACTION",
  UPDATE_PROFILE: "UPDATE_PROFILE",
  
  // Server-to-client message types
  JOIN_ROOM_SUCCESS: "JOIN_ROOM_SUCCESS",
  CREATE_ROOM_SUCCESS: "CREATE_ROOM_SUCCESS",
  USER_JOINED: "USER_JOINED",
  USER_LEFT: "USER_LEFT",
  HOST_CHANGED: "HOST_CHANGED",
  KICKED: "KICKED",
  GAME_STARTING: "GAME_STARTING",
  NEW_QUESTION: "NEW_QUESTION",
  ANSWER_SUBMITTED: "ANSWER_SUBMITTED",
  QUESTION_RESULTS: "QUESTION_RESULTS",
  GAME_ENDED: "GAME_ENDED",
  GAME_PAUSED: "GAME_PAUSED",
  GAME_RESUMED: "GAME_RESUMED",
  GAME_STOPPED: "GAME_STOPPED",

  SETTINGS_UPDATED: "SETTINGS_UPDATED",
  ERROR: "ERROR",
  HEARTBEAT: "HEARTBEAT",
  QUESTION_SKIPPED: "QUESTION_SKIPPED",
  USER_REACTION: "USER_REACTION",
  PROFILE_UPDATED: "PROFILE_UPDATED",
  USER_PROFILE_UPDATED: "USER_PROFILE_UPDATED",
} as const;

export type WSMessageType = typeof WS_MESSAGE_TYPES[keyof typeof WS_MESSAGE_TYPES];

export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: number;
}

// Client-to-server message data types
export interface AuthData {
  token: string;
  adminToken?: string;
}

export interface CreateRoomData {
  username: string;
  settings?: Partial<RoomSettings>;
}

export interface JoinRoomData {
  inviteCode: string;
  username: string;
}

export interface SubmitAnswerData {
  answer: string;
  questionId?: string;
}

export interface UpdateSettingsData {
  settings: Partial<RoomSettings>;
}

export interface KickUserData {
  userId: string;
}

export interface ReactionData {
  reaction: string;
  targetUserId?: string;
}

export interface UpdateProfileData {
  color?: string;
  username?: string;
}

// Server-to-client message data types
export interface AuthSuccessData {
  userId: string;
  isAdmin: boolean;
  user: any;
  room: any;
}

export interface RoomSuccessData {
  room: any;
  user: any;
}

export interface UserJoinedData {
  user: any;
  room: any;
}

export interface UserLeftData {
  userId: string;
  room: any;
}

export interface HostChangedData {
  newHost: any;
}

export interface KickedData {
  reason: string;
}

export interface GameStartingData {
  gameState: any;
}

export interface NewQuestionData {
  question: any;
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
  playerAnswers: any[];
  leaderboard: GameStateLeaderboard[];
}

export interface GameEndedData {
  leaderboard: GameStateLeaderboard[];
}

export interface SettingsUpdatedData {
  settings: RoomSettings;
}

export interface QuestionSkippedData {
  skippedBy: string;
}

export interface UserReactionData {
  fromUserId: string;
  fromUsername: string;
  targetUserId?: string;
  reaction: string;
  timestamp: number;
}

export interface ProfileUpdatedData {
  user: any;
}

export interface UserProfileUpdatedData {
  userId: string;
  username: string;
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
  | { type: typeof WS_MESSAGE_TYPES.REACTION; data: ReactionData }
  | { type: typeof WS_MESSAGE_TYPES.UPDATE_PROFILE; data: UpdateProfileData }
  | { type: typeof WS_MESSAGE_TYPES.LEAVE_ROOM; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.START_GAME; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.PAUSE_GAME; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.RESUME_GAME; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.STOP_GAME; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.SKIP_QUESTION; data: {} }
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
  | { type: typeof WS_MESSAGE_TYPES.GAME_PAUSED; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.GAME_RESUMED; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.GAME_STOPPED; data: {} }
  | { type: typeof WS_MESSAGE_TYPES.SETTINGS_UPDATED; data: SettingsUpdatedData }
  | { type: typeof WS_MESSAGE_TYPES.QUESTION_SKIPPED; data: QuestionSkippedData }
  | { type: typeof WS_MESSAGE_TYPES.USER_REACTION; data: UserReactionData }
  | { type: typeof WS_MESSAGE_TYPES.PROFILE_UPDATED; data: ProfileUpdatedData }
  | { type: typeof WS_MESSAGE_TYPES.USER_PROFILE_UPDATED; data: UserProfileUpdatedData }
  | { type: typeof WS_MESSAGE_TYPES.ERROR; data: ErrorData }
  | { type: typeof WS_MESSAGE_TYPES.HEARTBEAT; data: {} };


