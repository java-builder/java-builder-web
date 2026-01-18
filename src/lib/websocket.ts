import { Client } from '@stomp/stompjs';

export const connectWebSocket = () => {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/f-learning/ws';
  
  const client = new Client({
    brokerURL: wsUrl,
    
    onConnect: () => {
      console.log('✅ WebSocket connected successfully!');
    },
    
    onStompError: (frame) => {
      console.error('❌ WebSocket error:', frame.headers['message']);
    },
    
    debug: () => {},
  });

  client.activate();
  
  return client;
};
