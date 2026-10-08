"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reelService = exports.ReelService = void 0;
const database_1 = require("../../config/database");
const CustomError_1 = require("../../common/errors/CustomError");
class ReelService {
    async createReel(userId, data) {
        const { mediaUrl, thumbnailUrl, duration, caption } = data;
        const reel = await database_1.prisma.reel.create({
            data: {
                authorId: userId,
                mediaUrl,
                thumbnailUrl,
                duration,
                caption
            }
        });
        return reel;
    }
    async getReelFeed(userId, cursor, limit = 10) {
        const reels = await database_1.prisma.reel.findMany({
            where: {
                author: { isPrivate: false, isActive: true, isBlocked: false }
            },
            take: limit + 1,
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { id: true, username: true, profilePhoto: true } },
                _count: { select: { likes: true, comments: true } }
            }
        });
        let hasNextPage = false;
        let nextCursor = null;
        if (reels.length > limit) {
            hasNextPage = true;
            const nextItem = reels.pop();
            nextCursor = nextItem?.id;
        }
        const reelIds = reels.map(r => r.id);
        const likes = await database_1.prisma.reelLike.findMany({
            where: { userId, reelId: { in: reelIds } }
        });
        const likedReelIds = new Set(likes.map(l => l.reelId));
        return {
            items: reels.map(r => ({
                ...r,
                likesCount: r._count.likes,
                commentsCount: r._count.comments,
                isLiked: likedReelIds.has(r.id),
                _count: undefined
            })),
            pagination: { nextCursor, hasMore: hasNextPage }
        };
    }
    async getReelById(reelId, userId) {
        const reel = await database_1.prisma.reel.findUnique({
            where: { id: reelId },
            include: {
                author: { select: { id: true, username: true, profilePhoto: true } },
                _count: { select: { likes: true, comments: true } }
            }
        });
        if (!reel)
            throw new CustomError_1.CustomError('Reel not found', 404);
        const like = await database_1.prisma.reelLike.findUnique({
            where: { userId_reelId: { userId, reelId } }
        });
        return {
            ...reel,
            likesCount: reel._count.likes,
            commentsCount: reel._count.comments,
            isLiked: !!like,
            _count: undefined
        };
    }
    async deleteReel(userId, reelId) {
        const reel = await database_1.prisma.reel.findUnique({ where: { id: reelId } });
        if (!reel)
            throw new CustomError_1.CustomError('Reel not found', 404);
        if (reel.authorId !== userId)
            throw new CustomError_1.CustomError('Unauthorized', 403);
        await database_1.prisma.reel.delete({ where: { id: reelId } });
        return { success: true };
    }
    async likeReel(userId, reelId) {
        const reel = await database_1.prisma.reel.findUnique({ where: { id: reelId } });
        if (!reel)
            throw new CustomError_1.CustomError('Reel not found', 404);
        await database_1.prisma.reelLike.upsert({
            where: { userId_reelId: { userId, reelId } },
            update: {},
            create: { userId, reelId }
        });
        // Notify author
        if (reel.authorId !== userId) {
            // create notification
        }
        return { success: true };
    }
    async unlikeReel(userId, reelId) {
        await database_1.prisma.reelLike.deleteMany({
            where: { userId, reelId }
        });
        return { success: true };
    }
}
exports.ReelService = ReelService;
exports.reelService = new ReelService();
