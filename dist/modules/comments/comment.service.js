"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentService = exports.CommentService = void 0;
const database_1 = require("../../config/database");
const CustomError_1 = require("../../common/errors/CustomError");
class CommentService {
    async createComment(userId, postId, text, parentCommentId) {
        const post = await database_1.prisma.post.findUnique({ where: { id: postId, deletedAt: null } });
        if (!post)
            throw new CustomError_1.CustomError('Post not found', 404);
        if (parentCommentId) {
            const parent = await database_1.prisma.comment.findUnique({ where: { id: parentCommentId } });
            if (!parent || parent.postId !== postId) {
                throw new CustomError_1.CustomError('Invalid parent comment', 400);
            }
        }
        const comment = await database_1.prisma.comment.create({
            data: {
                userId,
                postId,
                text,
                parentCommentId
            },
            include: {
                user: { select: { id: true, username: true, profilePhoto: true } }
            }
        });
        if (post.authorId !== userId) {
            await database_1.prisma.notification.create({
                data: {
                    recipientId: post.authorId,
                    actorId: userId,
                    type: 'POST_COMMENT',
                    entityId: comment.id,
                    message: text.substring(0, 50)
                }
            });
        }
        return comment;
    }
    async getComments(postId, cursor, limit = 20) {
        const comments = await database_1.prisma.comment.findMany({
            where: { postId, parentCommentId: null },
            take: limit + 1,
            ...(cursor && { cursor: { id: cursor }, skip: 1 }),
            orderBy: { createdAt: 'desc' },
            include: {
                user: { select: { id: true, username: true, profilePhoto: true } },
                _count: { select: { replies: true, likes: true } }
            }
        });
        let hasNextPage = false;
        let nextCursor = null;
        if (comments.length > limit) {
            hasNextPage = true;
            const nextItem = comments.pop();
            nextCursor = nextItem?.id;
        }
        return {
            items: comments.map(c => ({
                ...c,
                repliesCount: c._count.replies,
                likesCount: c._count.likes,
                _count: undefined
            })),
            pagination: {
                nextCursor,
                hasMore: hasNextPage
            }
        };
    }
    async updateComment(userId, commentId, text) {
        const comment = await database_1.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment)
            throw new CustomError_1.CustomError('Comment not found', 404);
        if (comment.userId !== userId)
            throw new CustomError_1.CustomError('Unauthorized', 403);
        return database_1.prisma.comment.update({
            where: { id: commentId },
            data: { text }
        });
    }
    async deleteComment(userId, commentId) {
        const comment = await database_1.prisma.comment.findUnique({
            where: { id: commentId },
            include: { post: { select: { authorId: true } } }
        });
        if (!comment)
            throw new CustomError_1.CustomError('Comment not found', 404);
        // The author of the post or the author of the comment can delete it
        if (comment.userId !== userId && comment.post.authorId !== userId) {
            throw new CustomError_1.CustomError('Unauthorized', 403);
        }
        await database_1.prisma.comment.delete({ where: { id: commentId } });
        return { success: true };
    }
    async likeComment(userId, commentId) {
        const comment = await database_1.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment)
            throw new CustomError_1.CustomError('Comment not found', 404);
        await database_1.prisma.commentLike.upsert({
            where: { userId_commentId: { userId, commentId } },
            update: {},
            create: { userId, commentId }
        });
        if (comment.userId !== userId) {
            await database_1.prisma.notification.create({
                data: {
                    recipientId: comment.userId,
                    actorId: userId,
                    type: 'COMMENT_LIKE',
                    entityId: commentId,
                }
            });
        }
        return { status: 'liked' };
    }
    async unlikeComment(userId, commentId) {
        await database_1.prisma.commentLike.deleteMany({
            where: { userId, commentId }
        });
        return { status: 'unliked' };
    }
}
exports.CommentService = CommentService;
exports.commentService = new CommentService();
