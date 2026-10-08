"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storyService = exports.StoryService = void 0;
const database_1 = require("../../config/database");
const CustomError_1 = require("../../common/errors/CustomError");
class StoryService {
    async createStory(userId, data) {
        const { mediaUrl, mediaType, caption } = data;
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiration
        const story = await database_1.prisma.story.create({
            data: {
                userId,
                mediaUrl,
                mediaType,
                caption,
                expiresAt
            }
        });
        return story;
    }
    async getStories(userId) {
        // Get stories of followings and own stories, active only
        const following = await database_1.prisma.follow.findMany({
            where: { followerId: userId },
            select: { followingId: true }
        });
        const userIds = [userId, ...following.map(f => f.followingId)];
        const stories = await database_1.prisma.story.findMany({
            where: {
                userId: { in: userIds },
                expiresAt: { gt: new Date() }
            },
            orderBy: { createdAt: 'asc' },
            include: {
                user: { select: { id: true, username: true, profilePhoto: true } }
            }
        });
        // Group stories by user
        const grouped = stories.reduce((acc, story) => {
            const { user, ...storyData } = story;
            if (!acc[user.id]) {
                acc[user.id] = { user, stories: [] };
            }
            acc[user.id].stories.push(storyData);
            return acc;
        }, {});
        return Object.values(grouped);
    }
    async viewStory(userId, storyId) {
        const story = await database_1.prisma.story.findUnique({ where: { id: storyId } });
        if (!story)
            throw new CustomError_1.CustomError('Story not found', 404);
        if (story.userId !== userId) {
            await database_1.prisma.storyView.upsert({
                where: { storyId_viewerId: { storyId, viewerId: userId } },
                update: { viewedAt: new Date() },
                create: { storyId, viewerId: userId }
            });
            // Story view notification could be grouped or muted depending on volume
        }
        return { success: true };
    }
    async reactToStory(userId, storyId, type) {
        const story = await database_1.prisma.story.findUnique({ where: { id: storyId } });
        if (!story)
            throw new CustomError_1.CustomError('Story not found', 404);
        // Send a real-time message or notification
        await database_1.prisma.notification.create({
            data: {
                recipientId: story.userId,
                actorId: userId,
                type: 'STORY_REACTION',
                entityId: storyId,
                message: type // 'LIKE', 'LOVE', etc.
            }
        });
        return { success: true };
    }
    async deleteStory(userId, storyId) {
        const story = await database_1.prisma.story.findUnique({ where: { id: storyId } });
        if (!story)
            throw new CustomError_1.CustomError('Story not found', 404);
        if (story.userId !== userId)
            throw new CustomError_1.CustomError('Unauthorized', 403);
        await database_1.prisma.story.delete({ where: { id: storyId } });
        return { success: true };
    }
}
exports.StoryService = StoryService;
exports.storyService = new StoryService();
