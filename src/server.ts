import http from 'http';
import app from './app';
import { env } from './config/env';
import { Server } from 'socket.io';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  },
});

import { setupSocketHandlers } from './socket';
import './workers/media.worker'; // Initialize background workers

setupSocketHandlers(io);

const PORT = env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} in ${env.NODE_ENV} mode`);
});
