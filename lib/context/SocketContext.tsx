"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { logger } from "@/lib/utils/logger";
import { WS_MESSAGE_TYPES } from "@/lib/types/socket";
import { Room, RoomSettings } from "../types/multiplayer";
import { GameSettings } from "./SettingsContext";

export interface User {
  id: string;
  socketId: string;
  username: string;
  roomId: string;
  created: string;
  color: string;
  isAdmin: boolean;
  score: number;
  currentAnswer?: string;
  answerTime?: number;
  lastActiveTime: string;
}

export interface GameQuestion {
  questionNumber: number;
  country: {
    code: string;
    name: string;
    flag: string;
  };
  options: Array<{
    code: string;
    name: string;
    flag: string;
  }>;
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
  phase: "waiting" | "starting" | "question" | "results" | "finished";
  currentQuestion: GameQuestion | null;
  answers: GameAnswer[];
  currentQuestionIndex: number;
  totalQuestions: number;
  difficulty: string;
  gameStartTime: number | null;
  gameEndTime: number | null;
  leaderboard: Array<{
    userId: string;
    username: string;
    score: number;
    correctAnswers: number;
    averageTime: number;
  }>;
}

export interface WebSocketMessage<T = any> {
  type: string;
  data: T;
  timestamp?: number;
}

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting";

export interface SocketContextType {
  connectionState: ConnectionState;
  isConnected: boolean;
  currentRoom: Room | null;
  currentUser: User | null;
  gameState: GameState | null;

  connect: () => void;
  disconnect: () => void;

  createRoom: (username: string, settings: Partial<RoomSettings>) => Promise<void>;
  joinRoom: (
    inviteCode: string,
    username: string,
    passcode?: string
  ) => Promise<void>;
  leaveRoom: () => Promise<void>;

  startGame: () => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;

  updateRoomSettings: (settings: Partial<Room["settings"]>) => Promise<void>;
  kickUser: (userId: string) => Promise<void>;

  sendMessage: (message: WebSocketMessage) => void;
  getConnectionStats: () => {
    connectionState: ConnectionState;
    reconnectAttempts: number;
    lastError: string | null;
  };
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

interface SocketProviderProps {
  children: ReactNode;
  wsUrl?: string;
  sessionToken: string | null;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  wsUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:3001/ws",
  sessionToken,
}) => {
  const [connectionState, setConnectionState] =
    useState<ConnectionState>("disconnected");
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [lastError, setLastError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000;

  const messageHandlers = useRef<Map<string, (data: any) => void>>(new Map());

  const setupMessageHandlers = useCallback(() => {
    messageHandlers.current.set(WS_MESSAGE_TYPES.HEARTBEAT, () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ type: WS_MESSAGE_TYPES.HEARTBEAT_RESPONSE, data: {} })
        );
      }
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.AUTH_SUCCESS, (data) => {
      data.user && setCurrentUser(data.user);
      data.room && setCurrentRoom(data.room);
    });


    messageHandlers.current.set(WS_MESSAGE_TYPES.CREATE_ROOM_SUCCESS, (data) => {
      setCurrentRoom(data.room);
      setCurrentUser(data.user);
      logger.info("Room created successfully (CREATE_ROOM_SUCCESS)");
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.JOIN_ROOM_SUCCESS, (data) => {
      setCurrentRoom(data.room);
      setCurrentUser(data.user);
      logger.info("Joined room successfully (JOIN_ROOM_SUCCESS)");
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.LEAVE_ROOM, () => {
      setCurrentRoom(null);
      setCurrentUser(null);
      setGameState(null);
      logger.info("Left room");
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.SETTINGS_UPDATED, (data) => {
      if (currentRoom && data.settings) {
        setCurrentRoom({ ...currentRoom as Room, settings: data.settings });
      }
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.USER_JOINED, (data) => {
      setCurrentRoom((prev) =>
        prev ? { ...prev, members: data.members } : null
      );
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.USER_LEFT, (data) => {
      setCurrentRoom((prev) =>
        prev ? { ...prev, members: data.members } : null
      );
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.GAME_STARTING, (data) => {
      setGameState((prev) => (prev ? { ...prev, phase: "starting" } : null));
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.NEW_QUESTION, (data) => {
      setGameState((prev) =>
        prev
          ? {
              ...prev,
              phase: "question",
              currentQuestion: data.question,
              answers: [],
            }
          : null
      );
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.ANSWER_SUBMITTED, (data) => {
      logger.info(`${data.username} submitted an answer`);
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.QUESTION_RESULTS, (data) => {
      setGameState((prev) =>
        prev
          ? {
              ...prev,
              phase: "results",
              answers: data.playerAnswers,
              leaderboard: data.leaderboard,
            }
          : null
      );
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.GAME_ENDED, (data) => {
      setGameState((prev) =>
        prev
          ? {
              ...prev,
              phase: "finished",
              isActive: false,
              leaderboard: data.leaderboard,
            }
          : null
      );
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.GAME_STOPPED, () => {
      setGameState((prev) =>
        prev
          ? {
              ...prev,
              phase: "waiting",
              isActive: false,
              currentQuestion: null,
            }
          : null
      );
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.GAME_PAUSED, () => {
      setGameState((prev) => (prev ? { ...prev, isPaused: true } : null));
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.GAME_RESUMED, () => {
      setGameState((prev) => (prev ? { ...prev, isPaused: false } : null));
    });

    messageHandlers.current.set(WS_MESSAGE_TYPES.ERROR, (data) => {
      setLastError(data.message || "An error occurred");
      logger.error("Socket error:", data);
    });
  }, [currentRoom]);

  const handleMessage = useCallback((event: MessageEvent) => {
    try {
      const message: WebSocketMessage = JSON.parse(event.data);
      const handler = messageHandlers.current.get(message.type);

      if (handler) {
        handler(message.data);
      } else {
        logger.warn("Unhandled message type:", message.type);
      }
    } catch (error) {
      logger.error("Error parsing WebSocket message:", error);
    }
  }, []);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    setConnectionState("connecting");
    setLastError(null);

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setConnectionState("connected");
        reconnectAttemptsRef.current = 0;
        logger.info("WebSocket connected");

        if (sessionToken) {
          wsRef.current?.send(
            JSON.stringify({
              type: WS_MESSAGE_TYPES.AUTH,
              data: {
                token: sessionToken,
              },
              timestamp: Date.now(),
            })
          );
        } else {
          logger.error("No sessionToken provided for AUTH handshake");
        }
      };

      wsRef.current.onmessage = handleMessage;

      wsRef.current.onclose = (event) => {
        setConnectionState("disconnected");

        if (event.code !== 1000) {
          // Not a normal closure
          logger.warn(
            "WebSocket closed unexpectedly:",
            event.code,
            event.reason
          );

          if (reconnectAttemptsRef.current < maxReconnectAttempts) {
            setConnectionState("reconnecting");
            reconnectAttemptsRef.current += 1;

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, reconnectDelay * Math.pow(2, reconnectAttemptsRef.current - 1));
          } else {
            setLastError("Failed to reconnect after multiple attempts");
          }
        }
      };

      wsRef.current.onerror = (error) => {
        logger.error("WebSocket error:", error);
        setLastError("Connection error occurred");
      };
    } catch (error) {
      setConnectionState("disconnected");
      setLastError("Failed to create WebSocket connection");
      logger.error("WebSocket connection error:", error);
    }
  }, [wsUrl, handleMessage]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "User disconnected");
      wsRef.current = null;
    }

    setConnectionState("disconnected");
    setCurrentRoom(null);
    setCurrentUser(null);
    setGameState(null);
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          ...message,
          timestamp: Date.now(),
        })
      );
    } else {
      logger.warn("Cannot send message: WebSocket not connected");
    }
  }, []);

  const createRoom = useCallback(
    async (username: string, settings: Partial<RoomSettings>) => {
      sendMessage({
        type: WS_MESSAGE_TYPES.CREATE_ROOM,
        data: { username, settings },
      });
    },
    [sendMessage]
  );

  const joinRoom = useCallback(
    async (inviteCode: string, username: string, passcode?: string) => {
      sendMessage({
        type: WS_MESSAGE_TYPES.JOIN_ROOM,
        data: { inviteCode, username, passcode },
      });
    },
    [sendMessage]
  );

  const leaveRoom = useCallback(async () => {
    sendMessage({
      type: WS_MESSAGE_TYPES.LEAVE_ROOM,
      data: {},
    });
  }, [sendMessage]);

  const startGame = useCallback(async () => {
    sendMessage({
      type: WS_MESSAGE_TYPES.START_GAME,
      data: {},
    });
  }, [sendMessage]);

  const submitAnswer = useCallback(
    async (answer: string) => {
      if (!gameState?.currentQuestion) {
        console.error("No active question");
        return;
      }

      sendMessage({
        type: WS_MESSAGE_TYPES.SUBMIT_ANSWER,
        data: {
          answer,
          questionId: gameState.currentQuestion.questionNumber.toString(),
        },
      });
    },
    [sendMessage, gameState]
  );

  const updateRoomSettings = useCallback(
    async (settings: Partial<Room["settings"]>) => {
      sendMessage({
        type: WS_MESSAGE_TYPES.UPDATE_SETTINGS,
        data: { settings },
      });
    },
    [sendMessage]
  );

  const kickUser = useCallback(
    async (userId: string) => {
      sendMessage({
        type: WS_MESSAGE_TYPES.KICK_USER,
        data: { userId },
      });
    },
    [sendMessage]
  );

  const getConnectionStats = useCallback(
    () => ({
      connectionState,
      reconnectAttempts: reconnectAttemptsRef.current,
      lastError,
    }),
    [connectionState, lastError]
  );

  useEffect(() => {
    setupMessageHandlers();
  }, [setupMessageHandlers]);

  useEffect(() => {
    if (currentRoom) {
      setGameState(currentRoom.gameState);
    }
  }, [currentRoom]);

  useEffect(() => {
    connect();

    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (heartbeatTimeoutRef.current) {
        clearTimeout(heartbeatTimeoutRef.current);
      }
    };
  }, []);

  const contextValue: SocketContextType = {
    connectionState,
    isConnected: connectionState === "connected",
    currentRoom,
    currentUser,
    gameState,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    submitAnswer,
    updateRoomSettings,
    kickUser,
    sendMessage,
    getConnectionStats,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketContext;
