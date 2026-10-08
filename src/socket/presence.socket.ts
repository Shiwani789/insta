import { Server, Socket } from 'socket.io';

// Note: A real app would use Redis to track online status across multiple instances
const onlineUsers = new Map<string, string>(); // userId -> socketId

export const setupPresenceSocket = (io: Server, socket: Socket, userId: string) => {
  onlineUsers.set(userId, socket.id);

  // Broadcast to others that user is online
  socket.broadcast.emit('user_online', { userId });

  socket.on('disconnect', () => {
    onlineUsers.delete(userId);
    socket.broadcast.emit('user_offline', { userId });
  });
};

export const isUserOnline = (userId: string) => onlineUsers.has(userId);
