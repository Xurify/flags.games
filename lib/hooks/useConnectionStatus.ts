import { useSocket } from '@/lib/context/SocketContext';
import { useEffect, useState } from 'react';

export const useConnectionStatus = () => {
  const { connectionState, getConnectionStats } = useSocket();
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const stats = getConnectionStats();

  return {
    connectionState,
    isOnline,
    isConnected: connectionState === 'connected',
    isConnecting: connectionState === 'connecting',
    isReconnecting: connectionState === 'reconnecting',
    stats
  };
};