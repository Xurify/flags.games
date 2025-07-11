import { useSocket } from '@/lib/context/SocketContext';
import { useEffect, useState } from 'react';

export const useGameState = () => {
  const { gameState, currentRoom, currentUser } = useSocket();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);

  useEffect(() => {
    if (!gameState?.currentQuestion || gameState.phase !== 'question') {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = now - (gameState.currentQuestion?.country ? Date.now() : 0);
      const remaining = Math.max(0, (gameState.currentQuestion?.timeLimit || 30) * 1000 - elapsed);
      setTimeRemaining(Math.ceil(remaining / 1000));
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [gameState?.currentQuestion, gameState?.phase]);

  return {
    gameState,
    currentRoom,
    currentUser,
    timeRemaining,
    isGameActive: gameState?.isActive || false,
    isGamePaused: gameState?.isPaused || false,
    currentPhase: gameState?.phase || 'waiting',
    currentQuestion: gameState?.currentQuestion,
    leaderboard: gameState?.leaderboard || []
  };
};