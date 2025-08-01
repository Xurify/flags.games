import { useEffect, useState } from 'react';
import { useSocket } from '@/lib/context/SocketContext';

export const useGameState = () => {
  const { gameState, currentRoom, currentUser } = useSocket();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);

  useEffect(() => {
    if (!gameState?.currentQuestion || gameState.phase !== 'question') {
      setTimeRemaining(null);
      setQuestionStartTime(null);
      return;
    }

    if (questionStartTime === null) {
      const startTime = gameState.currentQuestion?.startTime || Date.now();
      setQuestionStartTime(startTime);
    }

    const updateTimer = () => {
      if (questionStartTime === null) return;
      
      const now = Date.now();
      const timePerQuestion = currentRoom?.settings?.timePerQuestion || 10;
      const elapsed = now - questionStartTime;
      const remaining = Math.max(0, timePerQuestion * 1000 - elapsed);
      const timeRemainingSeconds = Math.ceil(remaining / 1000);
      
      setTimeRemaining(timeRemainingSeconds);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [gameState?.currentQuestion, gameState?.phase, currentRoom?.settings?.timePerQuestion, questionStartTime]);

  return {
    gameState,
    currentRoom,
    currentUser,
    timeRemaining,
    isGameActive: gameState?.isActive || false,
    currentPhase: gameState?.phase || 'waiting',
    currentQuestion: gameState?.currentQuestion,
    leaderboard: gameState?.leaderboard || []
  };
};