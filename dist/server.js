"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const socket_io_1 = require("socket.io");
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: env_1.env.CORS_ORIGIN,
        methods: ['GET', 'POST'],
    },
});
const socket_1 = require("./socket");
require("./workers/media.worker"); // Initialize background workers
(0, socket_1.setupSocketHandlers)(io);
const PORT = env_1.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT} in ${env_1.env.NODE_ENV} mode`);
});
