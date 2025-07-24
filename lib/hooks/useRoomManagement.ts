import { useSocket } from '@/lib/context/SocketContext';
import { useCallback } from 'react';

export const useRoomManagement = () => {
  const {
    currentRoom,
    currentUser,
    createRoom,
    joinRoom,
    leaveRoom,
    updateRoomSettings,
    kickUser
  } = useSocket();

  const isHost = useCallback(() => {
    return currentUser?.id === currentRoom?.host;
  }, [currentUser, currentRoom]);

  const canStartGame = useCallback(() => {
    if (!currentRoom || !isHost() || currentRoom.members.length < 2) return false;
    return true;
  }, [currentRoom, isHost]);

  const getRoomStats = useCallback(() => {
    if (!currentRoom) return null;

    return {
      memberCount: currentRoom.members.length,
      maxMembers: currentRoom.settings.maxRoomSize,
      inviteCode: currentRoom.inviteCode
    };
  }, [currentRoom]);

  return {
    currentRoom,
    currentUser,
    isHost,
    canStartGame,
    getRoomStats,
    createRoom,
    joinRoom,
    leaveRoom,
    updateRoomSettings,
    kickUser
  };
};