import { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
export function useWorkspaceSocket(workspaceId) {
    const socketRef = useRef();
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const socket = io('/', { path: '/socket.io' });
        socketRef.current = socket;
        if (workspaceId)
            socket.emit('join', workspaceId);
        socket.on('analysis:update', (payload) => {
            setMessages((prev) => [...prev, payload]);
        });
        return () => { socket.disconnect(); };
    }, [workspaceId]);
    return { messages };
}
