import { io } from 'socket.io-client';

// Change URL according to your local environment IP / localhost
const SOCKET_URL = 'http://10.0.2.2:5000';

let socket = null;

export const initiateSocketConnection = () => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      transports: ['websocket'],
    });
    console.log('Connecting socket...');
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;