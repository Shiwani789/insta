"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupSocketHandlers = void 0;
const jwt_1 = require("../common/utils/jwt");
const database_1 = require("../config/database");
const chat_socket_1 = require("./chat.socket");
const presence_socket_1 = require("./presence.socket");
const setupSocketHandlers = (io) => {
    // Authentication middleware
    io.use(async (socket, next) => {
        try {
            const token = socket.handshake.auth?.token || socket.handshake.headers?.authorization?.split(' ')[1];
            if (!token) {
                return next(new Error('Authentication error'));
            }
            const decoded = (0, jwt_1.verifyAccessToken)(token);
            const user = await database_1.prisma.user.findUnique({
                where: { id: decoded.id, isActive: true, isBlocked: false }
            });
            if (!user) {
                return next(new Error('Authentication error'));
            }
            socket.data.user = user;
            next();
        }
        catch (error) {
            next(new Error('Authentication error'));
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.data.user.id;
        // Join personal room for user-specific events (e.g. notifications)
        socket.join(`user:${userId}`);
        // Setup module-specific sockets
        (0, presence_socket_1.setupPresenceSocket)(io, socket, userId);
        (0, chat_socket_1.setupChatSocket)(io, socket, userId);
        socket.on('disconnect', () => {
            // Disconnect handling is in presence socket primarily
        });
    });
};
exports.setupSocketHandlers = setupSocketHandlers;
