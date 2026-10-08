import { Queue } from 'bullmq';
import { redisConnection } from '../config/redis';

export const mediaQueue = new Queue('media-processing', { connection: redisConnection });
export const notificationQueue = new Queue('notifications', { connection: redisConnection });
