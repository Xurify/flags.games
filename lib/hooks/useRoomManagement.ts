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
    if (!currentRoom || !isHost()) return false;

    const readyUsers = currentRoom.members.filter(member => member.isReady);
    return readyUsers.length >= 2 && readyUsers.length === currentRoom.members.length;
  }, [currentRoom, isHost]);

  const getRoomStats = useCallback(() => {
    if (!currentRoom) return null;

    return {
      memberCount: currentRoom.members.length,
      maxMembers: currentRoom.settings.maxRoomSize,
      readyCount: currentRoom.members.filter(m => m.isReady).length,
      isPrivate: currentRoom.settings.private,
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