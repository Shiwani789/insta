import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { env } from './config/env';

const app = express();

app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(helmet());
app.use(cors({ origin: env.CORS_ORIGIN }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

// Basic health check route
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'OK' });
});

import authRoutes from './modules/auth/auth.routes';
import userRoutes from './modules/users/user.routes';
import followRoutes from './modules/follows/follow.routes';
import postRoutes from './modules/posts/post.routes';
import likeRoutes from './modules/likes/like.routes';
import saveRoutes from './modules/saves/save.routes';
import commentRoutes from './modules/comments/comment.routes';
import feedRoutes from './modules/feed/feed.routes';
import exploreRoutes from './modules/explore/explore.routes';
import searchRoutes from './modules/search/search.routes';
import storyRoutes from './modules/stories/story.routes';
import reelRoutes from './modules/reels/reel.routes';
import messageRoutes from './modules/messages/message.routes';
import notificationRoutes from './modules/notifications/notification.routes';
import mediaRoutes from './modules/media/media.routes';
import settingsRoutes from './modules/settings/settings.routes';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api', followRoutes);
app.use('/api/posts', postRoutes);
app.use('/api', likeRoutes);
app.use('/api', saveRoutes);
app.use('/api', commentRoutes);
app.use('/api', feedRoutes);
app.use('/api', exploreRoutes);
app.use('/api', searchRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/reels', reelRoutes);
app.use('/api', messageRoutes);
app.use('/api', notificationRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/settings', settingsRoutes);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.statusCode || err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    error: err,
  });
});

export default app;
