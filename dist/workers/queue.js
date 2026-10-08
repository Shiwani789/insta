"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationQueue = exports.mediaQueue = void 0;
const bullmq_1 = require("bullmq");
const redis_1 = require("../config/redis");
exports.mediaQueue = new bullmq_1.Queue('media-processing', { connection: redis_1.redisConnection });
exports.notificationQueue = new bullmq_1.Queue('notifications', { connection: redis_1.redisConnection });
