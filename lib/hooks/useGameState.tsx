import { useMemo } from "react";
import { useSocket } from "@/lib/context/SocketContext";
import { useWallClockCountdown } from "@/lib/hooks/useWallClockCountdown";
import { TIME_PER_QUESTION_OPTIONS } from "../constants";

export const useGameState = () => {
  const { currentRoom, currentUser, connectionState } = useSocket();
  const gameState = useMemo(
    () => currentRoom?.gameState ?? null,
    [currentRoom]
  );

  const currentQuestion = gameState?.currentQuestion;
  const isQuestionPhase = gameState?.phase === "question" && !!currentQuestion;
  const durationSec =
    currentRoom?.settings?.timePerQuestion || TIME_PER_QUESTION_OPTIONS[1];

  const { timeRemainingSec } = useWallClockCountdown({
    durationSec,
    isActive: isQuestionPhase,
    resetKey: `useGameState-${currentQuestion?.index}-${durationSec}`,
    startTimeMs: currentQuestion?.startTime,
    intervalMs: 250,
  });

  const timeRemaining = isQuestionPhase ? Math.ceil(timeRemainingSec) : null;

  return {
    gameState,
    currentRoom,
    currentUser,
    timeRemaining,
    connectionState,
    isGameActive: gameState?.isActive || false,
    currentPhase: gameState?.phase || "waiting",
    currentQuestion: gameState?.currentQuestion,
    leaderboard: gameState?.leaderboard || [],
  };
};
