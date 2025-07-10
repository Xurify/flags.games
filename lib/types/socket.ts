export const WS_MESSAGE_TYPES = {
  HEARTBEAT: "HEARTBEAT",
  CREATE_ROOM_SUCCESS: "CREATE_ROOM_SUCCESS",
  JOIN_ROOM_SUCCESS: "JOIN_ROOM_SUCCESS",
  ROOM_CREATED: "ROOM_CREATED",
  ROOM_JOINED: "ROOM_JOINED",
  ROOM_LEFT: "ROOM_LEFT",
  ROOM_UPDATED: "ROOM_UPDATED",
  USER_JOINED: "USER_JOINED",
  USER_LEFT: "USER_LEFT",
  GAME_STARTING: "GAME_STARTING",
  NEW_QUESTION: "NEW_QUESTION",
  ANSWER_SUBMITTED: "ANSWER_SUBMITTED",
  QUESTION_RESULTS: "QUESTION_RESULTS",
  GAME_ENDED: "GAME_ENDED",
  GAME_STOPPED: "GAME_STOPPED",
  GAME_PAUSED: "GAME_PAUSED",
  GAME_RESUMED: "GAME_RESUMED",
  ERROR: "ERROR",
} as const;

export type WSMessageType = typeof WS_MESSAGE_TYPES[keyof typeof WS_MESSAGE_TYPES];


export interface WebSocketMessage {
  type: string;
  data?: any;
  timestamp?: number;
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
  questionId?: string;
}

export interface UpdateSettingsData {
  settings: Partial<RoomSettings>;
}

export interface KickUserData {
  userId: string;
}

export interface RoomSettings {
  maxRoomSize: number;
  difficulty: string;
  gameMode: string;
  timeLimit?: number;
}
