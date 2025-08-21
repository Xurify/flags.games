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
import { toast } from "sonner";

import { logger } from "@/lib/utils/logger";
import { audioManager } from "@/lib/utils/audioUtils";
import { useSettings } from "@/lib/context/SettingsContext";
import {
  WS_MESSAGE_TYPES,
  Room,
  RoomSettings,
  User,
  GameQuestion,
  GameAnswer,
  GameStateLeaderboard,
  AnswerSubmittedData,
} from "@/lib/types/socket";

export interface WebSocketMessage<T = any> {
  type: keyof typeof WS_MESSAGE_TYPES;
  data: T;
  timestamp?: number;
}

export type ConnectionState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "reconnecting";

export interface MessageDataTypes {
  [WS_MESSAGE_TYPES.HEARTBEAT]: {};
  [WS_MESSAGE_TYPES.AUTH_SUCCESS]: {
    user?: User;
    room?: Room;
    userId: string;
    isAdmin: boolean;
  };
  [WS_MESSAGE_TYPES.CREATE_ROOM_SUCCESS]: {
    room: Room;
    user: User;
  };
  [WS_MESSAGE_TYPES.JOIN_ROOM_SUCCESS]: {
    room: Room;
    user: User;
  };
  [WS_MESSAGE_TYPES.LEAVE_ROOM]: {};
  [WS_MESSAGE_TYPES.SETTINGS_UPDATED]: {
    settings: RoomSettings;
  };
  [WS_MESSAGE_TYPES.USER_JOINED]: {
    user: User;
    room: Room;
  };
  [WS_MESSAGE_TYPES.USER_LEFT]: {
    userId: string;
    room: Room | null;
  };
  [WS_MESSAGE_TYPES.HOST_CHANGED]: {
    newHost: User;
  };
  [WS_MESSAGE_TYPES.KICKED]: {
    reason: string;
  };
  [WS_MESSAGE_TYPES.GAME_STARTING]: {
    countdown: number;
  };
  [WS_MESSAGE_TYPES.NEW_QUESTION]: {
    question: GameQuestion;
    totalQuestions: number;
  };
  [WS_MESSAGE_TYPES.ANSWER_SUBMITTED]: AnswerSubmittedData;
  [WS_MESSAGE_TYPES.QUESTION_RESULTS]: {
    correctAnswer: string;
    correctCountry: {
      name: string;
      flag: string;
      code: string;
    };
    playerAnswers: GameAnswer[];
    leaderboard: GameStateLeaderboard[];
  };
  [WS_MESSAGE_TYPES.GAME_ENDED]: {
    leaderboard: GameStateLeaderboard[];
    gameStats: {
      totalQuestions: number;
      totalAnswers: number;
      correctAnswers: number;
      accuracy: number;
      averageTime: number;
      difficulty: string;
      duration: number;
    };
  };
  [WS_MESSAGE_TYPES.GAME_STOPPED]: { timestamp: number };
  [WS_MESSAGE_TYPES.ERROR]: {
    message: string;
    code?: string;
    details?: any;
  };
}

type MessageHandler<T extends keyof MessageDataTypes> = (
  data: MessageDataTypes[T]
) => void;

export interface SocketContextType {
  connectionState: ConnectionState;
  isConnected: boolean;
  currentRoom: Room | null;
  currentUser: User | null;

  connect: () => void;
  disconnect: () => void;

  createRoom: (
    username: string,
    settings: Partial<RoomSettings>
  ) => Promise<void>;
  joinRoom: (inviteCode: string, username: string) => Promise<void>;
  leaveRoom: () => Promise<void>;

  startGame: () => Promise<void>;
  submitAnswer: (answer: string) => Promise<void>;

  updateRoomSettings: (settings: Partial<Room["settings"]>) => Promise<void>;
  kickUser: (userId: string) => Promise<void>;

  sendMessage: (message: WebSocketMessage) => void;
  getConnectionStats: () => {
    connectionState: ConnectionState;
    reconnectAttempts: number;
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

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const MAX_RECONNECT_ATTEMPTS = 3;
  const RECONNECT_DELAY = 3000;

  const { settings } = useSettings();

  const messageHandlers = useRef<
    Map<keyof typeof WS_MESSAGE_TYPES, (data: any) => void>
  >(new Map());

  const setupMessageHandlers = useCallback(() => {
    messageHandlers.current.clear();

    const heartbeatHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.HEARTBEAT
    > = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: WS_MESSAGE_TYPES.HEARTBEAT_RESPONSE,
            data: {},
          })
        );
      }
    };

    const authSuccessHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.AUTH_SUCCESS
    > = (data) => {
      data.user && setCurrentUser(data.user);
      data.room && setCurrentRoom(data.room);
    };

    const createRoomSuccessHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.CREATE_ROOM_SUCCESS
    > = (data) => {
      setCurrentRoom(data.room);
      setCurrentUser(data.user);
      logger.info("Room created successfully (CREATE_ROOM_SUCCESS)");
    };

    const joinRoomSuccessHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.JOIN_ROOM_SUCCESS
    > = (data) => {
      setCurrentRoom(data.room);
      setCurrentUser(data.user);
      logger.info("Joined room successfully (JOIN_ROOM_SUCCESS)");
    };

    const leaveRoomHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.LEAVE_ROOM
    > = () => {
      setCurrentRoom(null);
      setCurrentUser(null);
      logger.info("Left room");
    };

    const settingsUpdatedHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.SETTINGS_UPDATED
    > = (data) => {
      if (currentRoom && data.settings) {
        setCurrentRoom({ ...(currentRoom as Room), settings: data.settings });
      }
    };

    const userJoinedHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.USER_JOINED
    > = (data) => {
      setCurrentRoom((prev) =>
        prev && data.room ? { ...prev, members: data.room.members } : null
      );
    };

    const userLeftHandler: MessageHandler<typeof WS_MESSAGE_TYPES.USER_LEFT> = (
      data
    ) => {
      setCurrentRoom((prev) =>
        prev && data.room ? { ...prev, members: data.room.members } : null
      );
    };

    const hostChangedHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.HOST_CHANGED
    > = (data) => {
      setCurrentRoom((prev) =>
        prev ? { ...prev, host: data.newHost.id } : null
      );
    };

    const kickedHandler: MessageHandler<typeof WS_MESSAGE_TYPES.KICKED> = (
      data
    ) => {
      setCurrentRoom(null);
      setCurrentUser(null);
      logger.info("Kicked from room:", data.reason);
    };

    const gameStartingHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.GAME_STARTING
    > = (data) => {
      setCurrentRoom((prev) =>
        prev
          ? {
              ...prev,
              gameState: prev.gameState
                ? {
                    ...prev.gameState,
                    phase: "starting",
                    isActive: true,
                  }
                : {
                    isActive: true,
                    phase: "starting",
                    currentQuestion: null,
                    answers: [],
                    currentQuestionIndex: 0,
                    totalQuestions: 0,
                    difficulty: "easy",
                    gameStartTime: Date.now(),
                    gameEndTime: null,
                    usedCountries: new Set<string>(),
                    questionTimer: null,
                    resultTimer: null,
                    leaderboard: [],
                  },
            }
          : null
      );
    };

    const newQuestionHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.NEW_QUESTION
    > = (data) => {
      setCurrentRoom((prev) =>
        prev
          ? {
              ...prev,
              gameState: prev.gameState
                ? {
                    ...prev.gameState,
                    phase: "question",
                    currentQuestion: data.question,
                    answers: [],
                  }
                : prev.gameState,
            }
          : null
      );
    };

    const answerSubmittedHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.ANSWER_SUBMITTED
    > = (data) => {
      logger.info(
        `${data.username} submitted an answer (${data.totalAnswers}/${data.totalPlayers})`
      );
      if (
        settings.soundEffectsEnabled &&
        data.userId !== currentUser?.id
      ) {
        audioManager.playAnswerSubmittedSound();
      }
    };

    const questionResultsHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.QUESTION_RESULTS
    > = (data) => {
      // Single source of truth: update room's gameState and members; the effect syncing
      // currentRoom -> gameState will propagate changes to `gameState`
      setCurrentRoom((prev) =>
        prev
          ? {
              ...prev,
              gameState: prev.gameState
                ? {
                    ...prev.gameState,
                    phase: "results",
                    answers: data.playerAnswers,
                    leaderboard: data.leaderboard,
                  }
                : prev.gameState,
              members: prev.members.map((member) => {
                const updated = data.leaderboard.find(
                  (entry) => entry.userId === member.id
                );
                return updated ? { ...member, score: updated.score } : member;
              }),
            }
          : null
      );
    };

    const gameEndedHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.GAME_ENDED
    > = (data) => {
      setCurrentRoom((prev) =>
        prev
          ? {
              ...prev,
              gameState: prev.gameState
                ? {
                    ...prev.gameState,
                    phase: "finished",
                    isActive: false,
                    leaderboard: data.leaderboard,
                  }
                : prev.gameState,
            }
          : null
      );
    };

    const gameStoppedHandler: MessageHandler<
      typeof WS_MESSAGE_TYPES.GAME_STOPPED
    > = () => {
      setCurrentRoom((prev) =>
        prev
          ? {
              ...prev,
              gameState: prev.gameState
                ? {
                    ...prev.gameState,
                    phase: "waiting",
                    isActive: false,
                    currentQuestion: null,
                    answers: [],
                    currentQuestionIndex: 0,
                    totalQuestions: 0,
                    gameStartTime: null,
                    gameEndTime: null,
                    usedCountries: new Set(),
                    questionTimer: null,
                    resultTimer: null,
                    leaderboard: [],
                  }
                : prev.gameState,
            }
          : null
      );
    };

    const errorHandler: MessageHandler<typeof WS_MESSAGE_TYPES.ERROR> = (
      data
    ) => {
      toast.error(data.message);
    };

    messageHandlers.current.set(WS_MESSAGE_TYPES.HEARTBEAT, heartbeatHandler);
    messageHandlers.current.set(
      WS_MESSAGE_TYPES.AUTH_SUCCESS,
      authSuccessHandler
    );
    messageHandlers.current.set(
      WS_MESSAGE_TYPES.CREATE_ROOM_SUCCESS,
      createRoomSuccessHandler
    );
    messageHandlers.current.set(
      WS_MESSAGE_TYPES.JOIN_ROOM_SUCCESS,
      joinRoomSuccessHandler
    );
    messageHandlers.current.set(WS_MESSAGE_TYPES.LEAVE_ROOM, leaveRoomHandler);
    messageHandlers.current.set(
      WS_MESSAGE_TYPES.SETTINGS_UPDATED,
      settingsUpdatedHandler
    );
    messageHandlers.current.set(
      WS_MESSAGE_TYPES.USER_JOINED,
      userJoinedHandler
    );
    messageHandlers.current.set(WS_MESSAGE_TYPES.USER_LEFT, userLeftHandler);
    messageHandlers.current.set(
      WS_MESSAGE_TYPES.HOST_CHANGED,
      hostChangedHandler
    );
    messageHandlers.current.set(WS_MESSAGE_TYPES.KICKED, kickedHandler);
    messageHandlers.current.set(
      WS_MESSAGE_TYPES.GAME_STARTING,
      gameStartingHandler
    );
    messageHandlers.current.set(
      WS_MESSAGE_TYPES.NEW_QUESTION,
      newQuestionHandler
    );
    messageHandlers.current.set(
      WS_MESSAGE_TYPES.ANSWER_SUBMITTED,
      answerSubmittedHandler
    );
    messageHandlers.current.set(
      WS_MESSAGE_TYPES.QUESTION_RESULTS,
      questionResultsHandler
    );
    messageHandlers.current.set(WS_MESSAGE_TYPES.GAME_ENDED, gameEndedHandler);
    messageHandlers.current.set(
      WS_MESSAGE_TYPES.GAME_STOPPED,
      gameStoppedHandler
    );
    messageHandlers.current.set(WS_MESSAGE_TYPES.ERROR, errorHandler);
  }, [currentRoom, currentUser, settings.soundEffectsEnabled]);

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
          logger.warn(
            "WebSocket closed unexpectedly:",
            event.code,
            event.reason
          );

          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            setConnectionState("reconnecting");
            reconnectAttemptsRef.current += 1;

            reconnectTimeoutRef.current = setTimeout(() => {
              connect();
            }, RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current - 1));
          } else {
            toast.error("Failed to reconnect after multiple attempts", {
              duration: 10000,
            });
          }
        }
      };

      wsRef.current.onerror = (error) => {
        logger.error("WebSocket error:", error);
        if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
        toast.error("WebSocket connection error occurred", {
          duration: 10000,
          description: `Retrying ${
              MAX_RECONNECT_ATTEMPTS - reconnectAttemptsRef.current
            } more time(s)`,
          });
        }
      };
    } catch (error) {
      setConnectionState("disconnected");
      toast.error("Failed to create WebSocket connection", { duration: 10000 });
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
      toast.error("Cannot send message: WebSocket not connected", {
        duration: 10000,
      });
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
    async (inviteCode: string, username: string) => {
      sendMessage({
        type: WS_MESSAGE_TYPES.JOIN_ROOM,
        data: { inviteCode, username },
      });
    },
    [sendMessage]
  );

  const leaveRoom = useCallback(async () => {
    sendMessage({
      type: WS_MESSAGE_TYPES.LEAVE_ROOM,
      data: {},
    });
    disconnect();
  }, [sendMessage]);

  const startGame = useCallback(async () => {
    sendMessage({
      type: WS_MESSAGE_TYPES.START_GAME,
      data: {},
    });
  }, [sendMessage]);

  const submitAnswer = useCallback(
    async (answer: string) => {
      const activeQuestion = currentRoom?.gameState?.currentQuestion;
      if (!activeQuestion) {
        logger.error("No active question");
        return;
      }

      sendMessage({
        type: WS_MESSAGE_TYPES.SUBMIT_ANSWER,
        data: {
          answer,
          questionId: activeQuestion.questionNumber.toString(),
        },
      });
    },
    [sendMessage, currentRoom]
  );

  const updateRoomSettings = useCallback(
    async (settings: Partial<Room["settings"]>) => {
      sendMessage({
        type: WS_MESSAGE_TYPES.UPDATE_ROOM_SETTINGS,
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
    }),
    [connectionState]
  );

  useEffect(() => {
    setupMessageHandlers();
  }, [setupMessageHandlers]);
  
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
