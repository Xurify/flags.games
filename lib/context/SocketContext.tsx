"use client";

import React, { createContext, useContext, useEffect, useRef, useState, ReactNode, useMemo } from "react";
import { toast } from "sonner";

import { logger } from "@/lib/utils/logger";
import { audioManager } from "@/lib/utils/audio-manager";
import { useSettings } from "@/lib/context/SettingsContext";
import {
  WS_MESSAGE_TYPES,
  Room,
  RoomSettings,
  User,
  GameQuestion,
  GameStateLeaderboard,
  AnswerSubmittedData,
  QuestionResultsData,
  GamePhase,
} from "@/lib/types/socket";
import { ErrorCode } from "../types/errorCodes";

export interface WebSocketMessage<T = unknown> {
  type: keyof typeof WS_MESSAGE_TYPES;
  data: T;
  timestamp?: number;
}

export type ConnectionState = "disconnected" | "connecting" | "connected" | "reconnecting";

export interface MessageDataTypes {
  [WS_MESSAGE_TYPES.HEARTBEAT]: Record<string, never>;
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
  [WS_MESSAGE_TYPES.LEAVE_ROOM]: Record<string, never>;
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
  [WS_MESSAGE_TYPES.USER_KICKED]: {
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
    startTime?: number;
  };
  [WS_MESSAGE_TYPES.GAME_RESTARTED]: {
    countdown: number;
  };
  [WS_MESSAGE_TYPES.NEW_QUESTION]: {
    question: GameQuestion;
    totalQuestions: number;
  };
  [WS_MESSAGE_TYPES.ANSWER_SUBMITTED]: AnswerSubmittedData;
  [WS_MESSAGE_TYPES.QUESTION_RESULTS]: QuestionResultsData;
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
    details?: unknown;
  };
  [WS_MESSAGE_TYPES.ROOM_TTL_WARNING]: {
    roomId: string;
    expiresAt: number;
    remainingMs: number;
  };
  [WS_MESSAGE_TYPES.ROOM_EXPIRED]: {
    roomId: string;
    expiredAt: number;
  };
}

export interface SocketContextType {
  connectionState: ConnectionState;
  isConnected: boolean;
  currentUser: User | null;
  currentRoom: Room | null;
  gameState: Room["gameState"] | null;
  isGameActive: boolean;
  currentPhase: GamePhase;
  currentQuestion: any;
  leaderboard: GameStateLeaderboard[];

  connect: () => void;
  disconnect: () => void;

  createRoom: (username: string, settings: Partial<RoomSettings>) => Promise<void>;
  joinRoom: (inviteCode: string, username: string) => Promise<void>;
  leaveRoom: () => Promise<void>;

  startGame: () => Promise<void>;
  restartGame: () => Promise<void>;
  stopGame: () => Promise<void>;
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
}

export const SocketProvider: React.FC<SocketProviderProps> = ({
  children,
  wsUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:3001/ws",
}) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>("disconnected");
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptsRef = useRef(0);
  const reconnectToastIdRef = useRef<string | number | null>(null);
  const disconnectedToastIdRef = useRef<string | number | null>(null);
  const connectRef = useRef<() => void>(() => {});

  const MAX_RECONNECT_ATTEMPTS = 3;
  const RECONNECT_DELAY = 3000;

  const { settings } = useSettings();

  const messageHandlers = useRef<Map<keyof typeof WS_MESSAGE_TYPES, (data: unknown) => void>>(new Map());

  useEffect(() => {
    messageHandlers.current.clear();

    const heartbeatHandler = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: WS_MESSAGE_TYPES.HEARTBEAT_RESPONSE,
            data: {},
          })
        );
      }
    };

    const authSuccessHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.AUTH_SUCCESS]) => {
      if (data.user) setCurrentUser(data.user);
      if (data.room) setCurrentRoom(data.room);
    };

    const createRoomSuccessHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.CREATE_ROOM_SUCCESS]) => {
      setCurrentRoom(data.room);
      setCurrentUser(data.user);
      logger.info("Created room successfully (CREATE_ROOM_SUCCESS)");
    };

    const joinRoomSuccessHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.JOIN_ROOM_SUCCESS]) => {
      setCurrentRoom(data.room);
      setCurrentUser(data.user);
      logger.info("Joined room successfully (JOIN_ROOM_SUCCESS)");
    };

    const leaveRoomHandler = () => {
      setCurrentRoom(null);
      setCurrentUser(null);
      logger.info("Left room");
    };

    const settingsUpdatedHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.SETTINGS_UPDATED]) => {
      setCurrentRoom((prev) => (prev ? { ...prev, settings: data.settings } : prev));
    };

    const userJoinedHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.USER_JOINED]) => {
      setCurrentRoom((prev) => (prev && data.room ? { ...prev, members: data.room.members } : null));

      if (settings.soundEffectsEnabled && data.user.id !== currentUser?.id && data.room?.gameState?.phase !== "finished") {
        audioManager.playTone(440, 0.14, "triangle");
        audioManager.playTone(554.37, 0.14, "triangle");
      }
    };

    const userLeftHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.USER_LEFT]) => {
      setCurrentRoom((prev) => (prev && data.room ? { ...prev, members: data.room.members } : null));

      if (settings.soundEffectsEnabled && data.userId !== currentUser?.id && data.room?.gameState?.phase !== "finished") {
        audioManager.playTone(330, 0.18, "triangle");
      }
    };

    const userKickedHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.USER_KICKED]) => {
      setCurrentRoom((prev) => (prev && data.room ? { ...prev, members: data.room.members } : null));

      if (settings.soundEffectsEnabled && data.userId !== currentUser?.id && data.room?.gameState?.phase !== "finished") {
        audioManager.playTone(300, 0.16, "triangle");
      }
    };

    const hostChangedHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.HOST_CHANGED]) => {
      setCurrentRoom((prev) => (prev ? { ...prev, host: data.newHost.id } : null));
    };

    const kickedHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.KICKED]) => {
      setCurrentRoom(null);
      setCurrentUser(null);
      toast.error(data.reason || "Kicked by host");
      logger.info("Kicked from room:", data.reason);
    };

    const gameStartingHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.GAME_STARTING]) => {
      setCurrentRoom((prev) =>
        prev
          ? {
              ...prev,
              gameState: prev.gameState
                ? {
                    ...prev.gameState,
                    phase: "starting",
                    isActive: true,
                    gameStartTime: data.startTime || Date.now(),
                  }
                : {
                    isActive: true,
                    phase: "starting",
                    currentQuestion: null,
                    answers: [],
                    answerHistory: [],
                    currentQuestionIndex: 0,
                    totalQuestions: 0,
                    difficulty: "easy",
                    gameStartTime: data.startTime || Date.now(),
                    gameEndTime: null,
                    usedCountries: [],
                    questionTimer: null,
                    resultTimer: null,
                    leaderboard: [],
                  },
            }
          : null
      );
    };

    const gameRestartedHandler = () => {
      setCurrentRoom((prev) =>
        prev
          ? {
              ...prev,
              gameState: {
                isActive: true,
                phase: "starting",
                currentQuestion: null,
                answers: [],
                answerHistory: [],
                currentQuestionIndex: 0,
                totalQuestions: 0,
                difficulty: prev.gameState?.difficulty || "easy",
                gameStartTime: Date.now(),
                gameEndTime: null,
                usedCountries: [],
                questionTimer: null,
                resultTimer: null,
                leaderboard: [],
              },
              members: prev.members.map((member) => ({
                ...member,
                hasAnswered: false,
                score: 0,
              })),
            }
          : null
      );
    };

    const newQuestionHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.NEW_QUESTION]) => {
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
                    totalQuestions: data.totalQuestions,
                    resultTimer: null,
                  }
                : prev.gameState,
              members: prev.members.map((m) => ({ ...m, hasAnswered: false })),
            }
          : null
      );
    };

    const answerSubmittedHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.ANSWER_SUBMITTED]) => {
      logger.info(`${data.username} submitted an answer (${data.totalAnswers}/${data.totalPlayers})`);
      setCurrentRoom((prev) =>
        prev
          ? {
              ...prev,
              members: prev.members.map((member) => (member.id === data.userId ? { ...member, hasAnswered: true } : member)),
            }
          : null
      );
      if (settings.soundEffectsEnabled && data.userId !== currentUser?.id) {
        audioManager.playAnswerSubmittedSound();
      }
    };

    const questionResultsHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.QUESTION_RESULTS]) => {
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
                    resultTimer: data.timer,
                  }
                : prev.gameState,
            }
          : null
      );
    };

    const gameEndedHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.GAME_ENDED]) => {
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

    const gameStoppedHandler = () => {
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
                    usedCountries: [],
                    questionTimer: null,
                    resultTimer: null,
                    leaderboard: [],
                  }
                : prev.gameState,
            }
          : null
      );
    };

    const errorHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.ERROR]) => {
      if (data.message) {
        let description = null;

        if (data.code === ErrorCode.ROOM_NOT_FOUND) {
          description = "This room likely does not exist or was deleted.";
        } else if (data.code === ErrorCode.SESSION_ALREADY_STARTED) {
          description = "You are unable to join this room because the game has already started.";
        }

        toast.error(data.message, {
          description,
        });
      }
    };

    const ttlWarningHandler = (data: MessageDataTypes[typeof WS_MESSAGE_TYPES.ROOM_TTL_WARNING]) => {
      const seconds = Math.max(0, Math.floor(data.remainingMs / 1000));
      toast.warning("Room will expire soon", {
        description: `This room will be deleted in ${seconds}s. Finish up or create a new room.`,
        duration: 5000,
      });
    };

    const roomExpiredHandler = () => {
      setCurrentRoom(null);
      toast.warning("Room expired", {
        description: "This room reached its maximum lifetime and was deleted.",
        duration: Infinity,
        dismissible: true,
      });
    };

    // Helper to safely cast handlers. We know the socket routing ensures safe types.
    const register = <T extends keyof MessageDataTypes>(type: T, handler: (data: MessageDataTypes[T]) => void) => {
      messageHandlers.current.set(type, handler as unknown as (data: unknown) => void);
    };

    register(WS_MESSAGE_TYPES.HEARTBEAT, heartbeatHandler);
    register(WS_MESSAGE_TYPES.AUTH_SUCCESS, authSuccessHandler);
    register(WS_MESSAGE_TYPES.CREATE_ROOM_SUCCESS, createRoomSuccessHandler);
    register(WS_MESSAGE_TYPES.JOIN_ROOM_SUCCESS, joinRoomSuccessHandler);
    register(WS_MESSAGE_TYPES.LEAVE_ROOM, leaveRoomHandler);
    register(WS_MESSAGE_TYPES.SETTINGS_UPDATED, settingsUpdatedHandler);
    register(WS_MESSAGE_TYPES.USER_JOINED, userJoinedHandler);
    register(WS_MESSAGE_TYPES.USER_LEFT, userLeftHandler);
    register(WS_MESSAGE_TYPES.USER_KICKED, userKickedHandler);
    register(WS_MESSAGE_TYPES.HOST_CHANGED, hostChangedHandler);
    register(WS_MESSAGE_TYPES.KICKED, kickedHandler);
    register(WS_MESSAGE_TYPES.GAME_STARTING, gameStartingHandler);
    register(WS_MESSAGE_TYPES.GAME_RESTARTED, gameRestartedHandler);
    register(WS_MESSAGE_TYPES.NEW_QUESTION, newQuestionHandler);
    register(WS_MESSAGE_TYPES.ANSWER_SUBMITTED, answerSubmittedHandler);
    register(WS_MESSAGE_TYPES.QUESTION_RESULTS, questionResultsHandler);
    register(WS_MESSAGE_TYPES.GAME_ENDED, gameEndedHandler);
    register(WS_MESSAGE_TYPES.GAME_STOPPED, gameStoppedHandler);
    register(WS_MESSAGE_TYPES.ERROR, errorHandler);
    register(WS_MESSAGE_TYPES.ROOM_TTL_WARNING, ttlWarningHandler);
    register(WS_MESSAGE_TYPES.ROOM_EXPIRED, roomExpiredHandler);
  }, [currentRoom, currentUser, settings.soundEffectsEnabled]);

  const handleMessage = React.useCallback((event: MessageEvent) => {
    try {
      const message = JSON.parse(event.data) as WebSocketMessage;
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

  const connect = React.useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN || wsRef.current?.readyState === WebSocket.CONNECTING) {
      return;
    }

    setConnectionState("connecting");

    try {
      wsRef.current = new WebSocket(wsUrl);

      wsRef.current.onopen = () => {
        setConnectionState("connected");
        reconnectAttemptsRef.current = 0;
        if (reconnectToastIdRef.current) {
          toast.dismiss(reconnectToastIdRef.current);
          reconnectToastIdRef.current = null;
        }
        if (disconnectedToastIdRef.current) {
          toast.dismiss(disconnectedToastIdRef.current);
          disconnectedToastIdRef.current = null;
        }
        logger.info("WebSocket connected");
      };

      wsRef.current.onmessage = handleMessage;

      wsRef.current.onclose = (event) => {
        setConnectionState("disconnected");

        // If server closed due to a new session opened elsewhere, show info and do not auto-reconnect
        if (event.code === 4000) {
          if (reconnectToastIdRef.current) {
            toast.dismiss(reconnectToastIdRef.current);
            reconnectToastIdRef.current = null;
          }
          toast.info("This tab was disconnected: Session is open in another tab.", {
            duration: 8000,
          });
          return;
        }

        if (event.code !== 1000) {
          logger.warn("WebSocket closed unexpectedly:", event.code, event.reason);

          if (reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS) {
            setConnectionState("reconnecting");
            reconnectAttemptsRef.current += 1;
            if (!reconnectToastIdRef.current) {
              reconnectToastIdRef.current = toast.loading("Reconnecting...", {
                duration: Infinity,
                style: {
                  "--normal-bg": "#fef3c7",
                  "--normal-text": "#78350f",
                  "--normal-border": "#fcd34d",
                } as React.CSSProperties,
              });
            }
            reconnectTimeoutRef.current = setTimeout(() => {
              connectRef.current();
            }, RECONNECT_DELAY * Math.pow(2, reconnectAttemptsRef.current - 1));
          } else {
            if (reconnectToastIdRef.current) {
              toast.dismiss(reconnectToastIdRef.current);
              reconnectToastIdRef.current = null;
            }
            toast.error("Failed to reconnect after multiple attempts", {
              description: "Please refresh the page or try again later.",
              duration: 10000,
              className: "sm:!min-w-[480px]",
            });
          }
        }
      };

      wsRef.current.onerror = (error) => {
        logger.error("WebSocket error:", error);
      };
    } catch (error) {
      setConnectionState("disconnected");
      toast.error("Failed to create WebSocket connection", { duration: 10000 });
      logger.error("WebSocket connection error:", error);
    }
  }, [wsUrl, handleMessage]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const disconnect = React.useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (reconnectToastIdRef.current) {
      toast.dismiss(reconnectToastIdRef.current);
      reconnectToastIdRef.current = null;
    }
    if (disconnectedToastIdRef.current) {
      toast.dismiss(disconnectedToastIdRef.current);
      disconnectedToastIdRef.current = null;
    }

    if (wsRef.current) {
      wsRef.current.close(1000, "User disconnected");
      wsRef.current = null;
    }

    setConnectionState("disconnected");
    setCurrentRoom(null);
    setCurrentUser(null);
  }, []);

  const sendMessage = React.useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({
          ...message,
          timestamp: Date.now(),
        })
      );
    } else {
      logger.warn("Cannot send message: WebSocket not connected");
      if (!disconnectedToastIdRef.current) {
        disconnectedToastIdRef.current = toast.error("Connection lost - messages will be sent when reconnected", {
          duration: Infinity,
          dismissible: true,
        });
      }
    }
  }, []);

  const createRoom = React.useCallback(
    async (username: string, settings: Partial<RoomSettings>) => {
      sendMessage({
        type: WS_MESSAGE_TYPES.CREATE_ROOM,
        data: { username, settings },
      });
    },
    [sendMessage]
  );

  const joinRoom = React.useCallback(
    async (inviteCode: string, username: string) => {
      sendMessage({
        type: WS_MESSAGE_TYPES.JOIN_ROOM,
        data: { inviteCode, username },
      });
    },
    [sendMessage]
  );

  const leaveRoom = React.useCallback(async () => {
    sendMessage({
      type: WS_MESSAGE_TYPES.LEAVE_ROOM,
      data: {},
    });
    setCurrentRoom(null);
  }, [sendMessage]);

  const startGame = React.useCallback(async () => {
    sendMessage({
      type: WS_MESSAGE_TYPES.START_GAME,
      data: {},
    });
  }, [sendMessage]);

  const restartGame = React.useCallback(async () => {
    sendMessage({
      type: WS_MESSAGE_TYPES.RESTART_GAME,
      data: {},
    });
  }, [sendMessage]);

  const stopGame = React.useCallback(async () => {
    sendMessage({
      type: WS_MESSAGE_TYPES.STOP_GAME,
      data: {},
    });
  }, [sendMessage]);

  const submitAnswer = React.useCallback(
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
          questionId: activeQuestion.index.toString(),
        },
      });
    },
    [currentRoom, sendMessage]
  );

  const updateRoomSettings = React.useCallback(
    async (settings: Partial<Room["settings"]>) => {
      sendMessage({
        type: WS_MESSAGE_TYPES.UPDATE_ROOM_SETTINGS,
        data: { settings },
      });
    },
    [sendMessage]
  );

  const kickUser = React.useCallback(
    async (userId: string) => {
      sendMessage({
        type: WS_MESSAGE_TYPES.KICK_USER,
        data: { userId },
      });
    },
    [sendMessage]
  );

  const getConnectionStats = React.useCallback(
    () => ({
      connectionState,
      reconnectAttempts: reconnectAttemptsRef.current,
    }),
    [connectionState]
  );

  useEffect(() => {
    const t = setTimeout(() => connect(), 0);

    return () => {
      clearTimeout(t);
      disconnect();
    };
  }, [connect, disconnect, wsUrl]);

  useEffect(() => {
    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (reconnectToastIdRef.current) {
        toast.dismiss(reconnectToastIdRef.current);
        reconnectToastIdRef.current = null;
      }
    };
  }, []);

  const gameState = useMemo(() => currentRoom?.gameState ?? null, [currentRoom]);
  const isGameActive = gameState?.isActive || false;
  const currentPhase = gameState?.phase || "waiting";
  const currentQuestion = gameState?.currentQuestion;
  const leaderboard = gameState?.leaderboard || [];

  const contextValue: SocketContextType = {
    connectionState,
    isConnected: connectionState === "connected",
    currentRoom,
    currentUser,
    gameState,
    isGameActive,
    currentPhase,
    currentQuestion,
    leaderboard,
    connect,
    disconnect,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    restartGame,
    stopGame,
    submitAnswer,
    updateRoomSettings,
    kickUser,
    sendMessage,
    getConnectionStats,
  };

  return <SocketContext.Provider value={contextValue}>{children}</SocketContext.Provider>;
};

export default SocketContext;
