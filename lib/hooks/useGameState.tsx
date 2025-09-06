import { useMemo } from 'react';
import { useSocket } from '@/lib/context/SocketContext';
import { useWallClockCountdown } from '@/lib/hooks/useWallClockCountdown';

export const useGameState = () => {
  const { currentRoom, currentUser, connectionState } = useSocket();
  const gameState = useMemo(() => currentRoom?.gameState ?? null, [currentRoom]);

  const currentQuestion = gameState?.currentQuestion;
  const isQuestionPhase = gameState?.phase === 'question' && !!currentQuestion;
  const durationSec = currentRoom?.settings?.timePerQuestion || 10;

  const { timeRemainingSec } = useWallClockCountdown({
    durationSec,
    isActive: isQuestionPhase,
    resetKey: currentQuestion?.questionNumber,
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
    currentPhase: gameState?.phase || 'waiting',
    currentQuestion: gameState?.currentQuestion,
    leaderboard: gameState?.leaderboard || []
  };
};