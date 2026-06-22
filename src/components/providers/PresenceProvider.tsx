"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { connectWebSocket } from "@/lib/websocket";
import { Client } from "@stomp/stompjs";

interface WebSocketContextType {
  client: Client | null;
  isConnected: boolean;
}

const WebSocketContext = createContext<WebSocketContextType>({
  client: null,
  isConnected: false,
});

export const useWebSocket = () => useContext(WebSocketContext);

export default function PresenceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuth();
  const [client, setClient] = useState<Client | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      const activeClient = connectWebSocket();

      const originalOnConnect = activeClient.onConnect;
      activeClient.onConnect = (frame) => {
        if (originalOnConnect) {
          originalOnConnect(frame);
        }
        setIsConnected(true);
      };

      const originalOnWebSocketClose = activeClient.onWebSocketClose;
      activeClient.onWebSocketClose = (evt) => {
        if (originalOnWebSocketClose) {
          originalOnWebSocketClose(evt);
        }
        setIsConnected(false);
      };

      setClient(activeClient);

      return () => {
        activeClient.deactivate();
        setClient(null);
        setIsConnected(false);
      };
    }
  }, [isAuthenticated]);

  return (
    <WebSocketContext.Provider value={{ client, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
}
