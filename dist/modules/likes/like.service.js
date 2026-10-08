"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.likeService = exports.LikeService = void 0;
const database_1 = require("../../config/database");
const CustomError_1 = require("../../common/errors/CustomError");
class LikeService {
    async likePost(userId, postId) {
        const post = await database_1.prisma.post.findUnique({ where: { id: postId, deletedAt: null } });
        if (!post)
            throw new CustomError_1.CustomError('Post not found', 404);
        const like = await database_1.prisma.postLike.upsert({
            where: { userId_postId: { userId, postId } },
            update: {},
            create: { userId, postId }
        });
        // Handle notifications (e.g. if like.createdAt is new)
        if (post.authorId !== userId) {
            await database_1.prisma.notification.create({
                data: {
                    recipientId: post.authorId,
                    actorId: userId,
                    type: 'POST_LIKE',
                    entityId: postId,
                }
            });
        }
        return { status: 'liked' };
    }
    async unlikePost(userId, postId) {
        await database_1.prisma.postLike.deleteMany({
            where: { userId, postId }
        });
        return { status: 'unliked' };
    }
    async getPostLikes(postId) {
        const likes = await database_1.prisma.postLike.findMany({
            where: { postId },
            include: {
                user: {
                    select: { id: true, username: true, profilePhoto: true }
                }
            }
        });
        return likes.map((l) => l.user);
    }
}
exports.LikeService = LikeService;
exports.likeService = new LikeService();
