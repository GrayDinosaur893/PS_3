import { io } from "socket.io-client";

// In a real app use env variable
const SOCKET_URL = "http://localhost:4000";

export const socket = io(SOCKET_URL, {
  autoConnect: true,
  reconnection: true,
});
