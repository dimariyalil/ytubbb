import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export function useWorkspaceSocket(workspaceId?: string) {
  const socketRef = useRef<Socket>();
  const [messages, setMessages] = useState<{ stage: string; message: string }[]>([]);

  useEffect(() => {
    const socket = io('/', { path: '/socket.io' });
    socketRef.current = socket;
    if (workspaceId) socket.emit('join', workspaceId);
    socket.on('analysis:update', (payload) => {
      setMessages((prev) => [...prev, payload]);
    });
    return () => { socket.disconnect(); };
  }, [workspaceId]);

  return { messages };
}