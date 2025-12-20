import { useSocket } from '@/lib/context/SocketContext';

export const useRoomManagement = () => {
  const {
    currentRoom,
    currentUser,
    createRoom,
    joinRoom,
    leaveRoom,
    updateRoomSettings,
    kickUser,
    startGame,
  } = useSocket();

  const getIsHost = () => {
    return currentUser?.id === currentRoom?.host;
  };

  const isHost = getIsHost();

  const canStartGame = () => {
    if (!currentRoom || !isHost || currentRoom.members.length < 2) return false;
    return true;
  };

  const getRoomStats = () => {
    if (!currentRoom) return null;

    return {
      memberCount: currentRoom.members.length,
      maxMembers: currentRoom.settings.maxRoomSize,
      inviteCode: currentRoom.inviteCode
    };
  };

  return {
    currentRoom,
    currentUser,
    isHost,
    canStartGame,
    getRoomStats,
    createRoom,
    joinRoom,
    leaveRoom,
    startGame,
    updateRoomSettings,
    kickUser,
  };
};