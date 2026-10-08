"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserOnline = exports.setupPresenceSocket = void 0;
// Note: A real app would use Redis to track online status across multiple instances
const onlineUsers = new Map(); // userId -> socketId
const setupPresenceSocket = (io, socket, userId) => {
    onlineUsers.set(userId, socket.id);
    // Broadcast to others that user is online
    socket.broadcast.emit('user_online', { userId });
    socket.on('disconnect', () => {
        onlineUsers.delete(userId);
        socket.broadcast.emit('user_offline', { userId });
    });
};
exports.setupPresenceSocket = setupPresenceSocket;
const isUserOnline = (userId) => onlineUsers.has(userId);
exports.isUserOnline = isUserOnline;
